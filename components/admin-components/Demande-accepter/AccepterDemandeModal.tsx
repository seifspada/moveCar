'use client';

import { useState, useRef } from 'react';
import {
  X, Upload, FileText, Calendar,
  Car, Clock, MapPin, StickyNote,
  Loader2, CheckCircle,
} from 'lucide-react';

// ===================== TYPES =====================

interface AccepterDemandeData {
  dateSignature:            string;
  dateFinContrat:           string;
  notesInternes:            string;
  prixParKm?:               number;
  depassementKilometrage?:  number;
  retardSansAvertissement?: number;
  restitutionAutreEndroit?: number;
  contrat:                  File | null;
}

interface Props {
  demandeId:     number;
  nomPartenaire: string;
  onClose:       () => void;
  onSuccess?:    () => void;
}

// ===================== HELPERS =====================

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

// ===================== SOUS-COMPOSANTS =====================

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-100">
      {children}
    </h3>
  );
}

function Field({
  label, required, icon, children,
}: {
  label: string; required?: boolean; icon?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
        {icon}{label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 ' +
  'rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 ' +
  'focus:border-blue-400 transition placeholder:text-gray-300';

function NumericInput({
  placeholder, suffix, value, onChange,
}: {
  placeholder: string; suffix: string;
  value: number | undefined; onChange: (val: number | undefined) => void;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        step="0.0001"
        min="0"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
        className={`${inputClass} pr-9`}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
        {suffix}
      </span>
    </div>
  );
}

// ===================== COMPOSANT PRINCIPAL =====================

export function AccepterDemandeModal({ demandeId, nomPartenaire, onClose, onSuccess }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<AccepterDemandeData>({
    dateSignature:           '',
    dateFinContrat:          '',
    notesInternes:           '',
    prixParKm:               undefined,
    depassementKilometrage:  undefined,
    retardSansAvertissement: undefined,
    restitutionAutreEndroit: undefined,
    contrat:                 null,
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof AccepterDemandeData, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Validation ───────────────────────────────────────
  const validate = (): string | null => {
    // ✅ Guard ID — première vérification
    if (!demandeId || isNaN(Number(demandeId)) || Number(demandeId) <= 0)
      return 'ID de la demande invalide. Veuillez fermer et réessayer.';
    if (!form.dateSignature)
      return 'La date de signature est obligatoire.';
    if (!form.dateFinContrat)
      return 'La date de fin du contrat est obligatoire.';
    if (new Date(form.dateFinContrat) <= new Date(form.dateSignature))
      return 'La date de fin doit être postérieure à la date de signature.';
    if (!form.contrat)
      return 'Le fichier contrat PDF est obligatoire.';
    if (form.contrat.type !== 'application/pdf')
      return 'Le fichier doit être au format PDF.';
    if (form.contrat.size > 10 * 1024 * 1024)
      return 'Le fichier ne doit pas dépasser 10 Mo.';
    return null;
  };

  // ── Soumission ───────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ✅ Log pour debug
    console.log('🔍 demandeId:', demandeId, '| type:', typeof demandeId);

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('dateSignature',  form.dateSignature);
      formData.append('dateFinContrat', form.dateFinContrat);
      formData.append('contrat',        form.contrat!);

      if (form.notesInternes)                          formData.append('notesInternes',           form.notesInternes);
      if (form.prixParKm               !== undefined)  formData.append('prixParKm',               String(form.prixParKm));
      if (form.depassementKilometrage  !== undefined)  formData.append('depassementKilometrage',  String(form.depassementKilometrage));
      if (form.retardSansAvertissement !== undefined)  formData.append('retardSansAvertissement', String(form.retardSansAvertissement));
      if (form.restitutionAutreEndroit !== undefined)  formData.append('restitutionAutreEndroit', String(form.restitutionAutreEndroit));

      // ✅ Number() force un entier propre dans l'URL
      const url = `/api/partenaire/demandes-partenaire/${Number(demandeId)}`;
      console.log('📤 POST →', url);

      const res = await fetch(url, {
        method:  'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body:    formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || `Erreur ${res.status}`);

      setSuccess(true);
      setTimeout(() => { onSuccess?.(); onClose(); }, 1800);
    } catch (err: any) {
      setError(err.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // ── État succès ──────────────────────────────────────
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">Demande acceptée !</p>
          <p className="text-sm text-gray-500 text-center">
            Le contrat a été enregistré et un email a été envoyé au partenaire.
          </p>
        </div>
      </div>
    );
  }

  // ── Modal ────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Accepter la demande</h2>
            <p className="text-sm text-gray-400 mt-0.5 truncate max-w-[300px]">{nomPartenaire}</p>
            {/* ✅ Affiche l'ID pour vérification visuelle en dev */}
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-gray-300 mt-0.5">ID: {demandeId}</p>
            )}
          </div>
          <button type="button" onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* ── Body scrollable ── */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* ══ Section Contrat ══ */}
          <section className="space-y-4">
            <SectionTitle>Contrat</SectionTitle>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Date de signature" required icon={<Calendar size={12} />}>
                <input
                  type="date"
                  value={form.dateSignature}
                  onChange={(e) => set('dateSignature', e.target.value)}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Date de fin" required icon={<Calendar size={12} />}>
                <input
                  type="date"
                  value={form.dateFinContrat}
                  onChange={(e) => set('dateFinContrat', e.target.value)}
                  className={inputClass}
                  required
                />
              </Field>
            </div>

            {/* Upload PDF */}
            <Field label="Fichier contrat PDF" required icon={<FileText size={12} />}>
              <div
                onClick={() => fileRef.current?.click()}
                className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed
                  rounded-xl cursor-pointer transition select-none
                  ${form.contrat
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
                  }`}
              >
                {form.contrat ? (
                  <>
                    <FileText className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-emerald-700 truncate">{form.contrat.name}</p>
                      <p className="text-xs text-emerald-400">{(form.contrat.size / 1024).toFixed(0)} Ko</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        set('contrat', null);
                        if (fileRef.current) fileRef.current.value = '';
                      }}
                      className="p-1 text-emerald-400 hover:text-red-400 transition-colors shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Cliquer pour uploader</p>
                      <p className="text-xs text-gray-400">PDF uniquement · max 10 Mo</p>
                    </div>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => set('contrat', e.target.files?.[0] ?? null)}
              />
            </Field>

            {/* Notes internes */}
            <Field label="Notes internes" icon={<StickyNote size={12} />}>
              <textarea
                value={form.notesInternes}
                onChange={(e) => set('notesInternes', e.target.value)}
                placeholder="Remarques internes sur ce contrat..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>
          </section>

          {/* ══ Section Tarification ══ */}
          <section className="space-y-4">
            <SectionTitle>
              Tarification{' '}
              <span className="text-gray-300 normal-case font-normal tracking-normal">— optionnel</span>
            </SectionTitle>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Prix par km" icon={<Car size={12} />}>
                <NumericInput placeholder="0.45" suffix="€/km"
                  value={form.prixParKm} onChange={(val) => set('prixParKm', val)} />
              </Field>
              <Field label="Dépassement kilométrage" icon={<Car size={12} />}>
                <NumericInput placeholder="300" suffix="km"
                  value={form.depassementKilometrage} onChange={(val) => set('depassementKilometrage', val)} />
              </Field>
              <Field label="Retard sans avertissement" icon={<Clock size={12} />}>
                <NumericInput placeholder="25.00" suffix="€/h"
                  value={form.retardSansAvertissement} onChange={(val) => set('retardSansAvertissement', val)} />
              </Field>
              <Field label="Restitution autre endroit" icon={<MapPin size={12} />}>
                <NumericInput placeholder="50.00" suffix="€/h"
                  value={form.restitutionAutreEndroit} onChange={(val) => set('restitutionAutreEndroit', val)} />
              </Field>
            </div>
          </section>

          {/* ── Erreur ── */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              ❌ {error}
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-1 pb-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100
                         hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-500
                         hover:bg-emerald-600 rounded-xl transition-colors disabled:opacity-50
                         flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Traitement...</>
                : <><CheckCircle className="w-4 h-4" /> Accepter la demande</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}