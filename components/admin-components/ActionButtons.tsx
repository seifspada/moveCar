'use client';

import { useState } from 'react';
import {
  CheckCircle, XCircle, Loader2,
  CalendarClock, AlertTriangle,
} from 'lucide-react';
import RendezVous        from '@/components/partenaire-components/partenaire-formulaire/Rendezvous';
import { usePartenaireForm } from '@/app/hooks/usePartenaireForm';

// ══════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════
interface Props {
  statutDemande: string;
  confirmer:     () => Promise<void>;
  refuser:       (motif?: string) => Promise<void>;
  reporter?:     (nouvelleDateRdv: string, nouveauCreneau: string) => Promise<void>;
  actionLoading: 'confirmer' | 'refuser' | 'reporter' | null;
  actionError:   string | null;
  actionableStatuts?: string[];
}

// ══════════════════════════════════════════════════════
// Modale générique
// ══════════════════════════════════════════════════════
interface ModalProps {
  isOpen:          boolean;
  onClose:         () => void;
  onConfirm:       () => void;
  title:           string;
  description:     string;
  confirmLabel:    string;
  confirmClass:    string;
  icon:            React.ReactNode;
  loading?:        boolean;
  confirmDisabled?: boolean;
  children?:       React.ReactNode;
}

function ConfirmModal({
  isOpen, onClose, onConfirm,
  title, description,
  confirmLabel, confirmClass,
  icon, loading, confirmDisabled,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Fenêtre */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto z-10">

        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-3">
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Contenu optionnel */}
        {children && (
          <div className="px-6 pb-3 max-h-[60vh] overflow-y-auto">
            {children}
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || confirmDisabled}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 rounded-xl transition-all ${confirmClass}`}
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// ActionButtons
// ══════════════════════════════════════════════════════
export function ActionButtons({
  statutDemande,
  confirmer,
  refuser,
  reporter,
  actionLoading,
  actionError,
  actionableStatuts = ['EN_ATTENTE'],
}: Props) {

  const [showModalConfirmer, setShowModalConfirmer] = useState(false);
  const [showModalRefuser,   setShowModalRefuser]   = useState(false);
  const [showModalReporter,  setShowModalReporter]  = useState(false);
  const [motif,              setMotif]              = useState('');

  const {
    formData,
    currentMonth,
    tousLesCreneaux,
    loadingCreneaux,
    getDaysInMonth,
    formatDateToString,
    formatMonthYear,
    isDateReserved,
    isDateFullyBooked,
    isCreneauReserved,
    isWeekend,
    handleInputChange,
    handleDateClick,
    setCreneau,
    handlePrevMonth,
    handleNextMonth,
    setFormData,
  } = usePartenaireForm();

  // ── Visibilité des boutons par statut ──────────────
  const isActionable  = actionableStatuts.includes(statutDemande);
  const peutConfirmer = statutDemande === 'EN_ATTENTE';
  const peutRefuser   = ['EN_ATTENTE', 'EN_COURS_TRAITEMENT'].includes(statutDemande);
  const peutReporter  = ['EN_ATTENTE', 'EN_COURS_TRAITEMENT'].includes(statutDemande);

  // ── Badge statut final (non actionnable) ──────────
  if (!isActionable) {
    const isAccepted = ['ACCEPTE', 'ACCEPTEE'].includes(statutDemande);
    const isRefused  = ['REFUSEE', 'REFUSE'].includes(statutDemande);
    const isEnCours  = statutDemande === 'EN_COURS_TRAITEMENT';

    return (
      <div className={`rounded-2xl p-4 text-center text-sm font-medium border ${
        isAccepted ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
        : isRefused ? 'bg-red-50    text-red-600    border-red-200'
        : isEnCours ? 'bg-blue-50   text-blue-600   border-blue-200'
        : 'bg-slate-50 text-slate-600 border-slate-200'
      }`}>
        {isAccepted  ? '✅ Demande acceptée'
        : isRefused  ? '❌ Demande refusée'
        : isEnCours  ? '📅 Rendez-vous en cours de traitement'
        : '⏳ Statut inconnu'}
      </div>
    );
  }

  // ── Handlers ──────────────────────────────────────
  const handleConfirmer = async () => {
    await confirmer();
    setShowModalConfirmer(false);
  };

  const handleRefuser = async () => {
    await refuser(motif || undefined);
    setShowModalRefuser(false);
    setMotif('');
  };

  const handleReporter = async () => {
    if (!formData.dateRdv || !formData.creneau || !reporter) return;
    await reporter(formData.dateRdv, formData.creneau);
    setShowModalReporter(false);
    setFormData((prev) => ({ ...prev, dateRdv: '', creneau: '' }));
  };

  // ── Rendu ──────────────────────────────────────────
  return (
    <>
      {/* ════════════════════════════════════════
          MODALE — Confirmer
      ════════════════════════════════════════ */}
      <ConfirmModal
        isOpen={showModalConfirmer}
        onClose={() => setShowModalConfirmer(false)}
        onConfirm={handleConfirmer}
        title="Confirmer la demande"
        description="Êtes-vous sûr de vouloir confirmer ? Un email de confirmation sera envoyé."
        confirmLabel="Oui, confirmer"
        confirmClass="bg-emerald-500 hover:bg-emerald-600"
        loading={actionLoading === 'confirmer'}
        icon={
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
        }
      />

      {/* ════════════════════════════════════════
          MODALE — Refuser
      ════════════════════════════════════════ */}
      <ConfirmModal
        isOpen={showModalRefuser}
        onClose={() => { setShowModalRefuser(false); setMotif(''); }}
        onConfirm={handleRefuser}
        title="Refuser la demande"
        description="Cette action est irréversible. Un email de refus sera envoyé."
        confirmLabel="Oui, refuser"
        confirmClass="bg-red-500 hover:bg-red-600"
        loading={actionLoading === 'refuser'}
        icon={
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
        }
      >
        <div className="space-y-2 pt-1">
          <label className="text-xs text-slate-500 font-medium uppercase tracking-wide">
            Motif du refus (optionnel)
          </label>
          <textarea
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Expliquer la raison du refus..."
            rows={3}
            className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-300 text-slate-700"
          />
        </div>
      </ConfirmModal>

      {/* ════════════════════════════════════════
          MODALE — Reporter
      ════════════════════════════════════════ */}
      <ConfirmModal
        isOpen={showModalReporter}
        onClose={() => setShowModalReporter(false)}
        onConfirm={handleReporter}
        title="Reporter le rendez-vous"
        description="Sélectionnez une nouvelle date et un créneau disponible."
        confirmLabel="Confirmer le report"
        confirmClass="bg-blue-500 hover:bg-blue-600"
        loading={actionLoading === 'reporter'}
        confirmDisabled={!formData.dateRdv || !formData.creneau}
        icon={
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <CalendarClock className="w-5 h-5 text-blue-600" />
          </div>
        }
      >
        <div className="pt-1">
          <RendezVous
            formData={formData}
            showCalendar={true}
            currentMonth={currentMonth}
            tousLesCreneaux={tousLesCreneaux}
            loadingCreneaux={loadingCreneaux}
            getDaysInMonth={getDaysInMonth}
            formatDateToString={formatDateToString}
            formatMonthYear={formatMonthYear}
            isDateReserved={isDateReserved}
            isDateFullyBooked={isDateFullyBooked}
            isCreneauReserved={isCreneauReserved}
            isWeekend={isWeekend}
            onChange={handleInputChange}
            onDateClick={handleDateClick}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onSelectCreneau={setCreneau}
          />

          {/* Récap sélection */}
          {formData.dateRdv && formData.creneau && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
              ✅ Nouveau RDV : <strong>{formData.dateRdv}</strong> à{' '}
              <strong>{formData.creneau}</strong>
            </div>
          )}
        </div>
      </ConfirmModal>

      {/* ════════════════════════════════════════
          CARD ACTIONS
      ════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">

        {/* Titre */}
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest border-l-4 border-orange-500 pl-3">
          Actions
        </h2>

        {/* Erreur */}
        {actionError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {actionError}
          </div>
        )}

        {/* Confirmer + Refuser */}
        <div className="flex gap-3">
          {peutConfirmer && (
            <button
              onClick={() => setShowModalConfirmer(true)}
              disabled={!!actionLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all duration-200"
            >
              {actionLoading === 'confirmer'
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <CheckCircle className="w-4 h-4" />}
              Confirmer
            </button>
          )}

          {peutRefuser && (
            <button
              onClick={() => setShowModalRefuser(true)}
              disabled={!!actionLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all duration-200"
            >
              {actionLoading === 'refuser'
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <XCircle className="w-4 h-4" />}
              Refuser
            </button>
          )}
        </div>

        {/* Reporter */}
        {reporter && peutReporter && (
          <button
            onClick={() => setShowModalReporter(true)}
            disabled={!!actionLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 disabled:opacity-50 text-blue-500 border border-blue-500/30 text-sm font-semibold rounded-xl transition-all duration-200"
          >
            {actionLoading === 'reporter'
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <CalendarClock className="w-4 h-4" />}
            Reporter le rendez-vous
          </button>
        )}

      </div>
    </>
  );
}