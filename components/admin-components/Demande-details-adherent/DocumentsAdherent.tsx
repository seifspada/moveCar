// components/admin-components/Demande-adherent-details/DocumentsAdherent.tsx
'use client';

import {
  FileText, Eye, CheckCircle, Clock,
  CalendarDays, Pencil, Save, X,
} from 'lucide-react';
import { useState } from 'react';
import { DocumentAdherent, TypeDocument } from '@/app/types/adherent';
import { buildDocumentUrl } from '@/lib/api';

const LABEL: Record<TypeDocument, string> = {
  CARTE_IDENTITE:    "Carte d'identité",
  PERMIS:            'Permis',
  KBIS:              'KBIS',
  RIB:               'RIB',
  RC_PRO:            'Assurance RC Pro',
  RC_CIRCULATION:    'Assurance RC Circulation',
  CASIER_JUDICIAIRE: 'Casier judiciaire',
  W_GARAGE:          'Carte grise W Garage',
};

const TYPE_ORDER: TypeDocument[] = [
  'CARTE_IDENTITE', 'PERMIS', 'KBIS', 'RIB',
  'RC_PRO', 'RC_CIRCULATION', 'CASIER_JUDICIAIRE', 'W_GARAGE',
];

const EDITABLE_TYPES: TypeDocument[] = ['RC_PRO', 'RC_CIRCULATION','KBIS'];

type EditState = { dateDebutValidite: string; dateFinValidite: string };

type Props = {
  documents:             DocumentAdherent[];
  demandeId:             number;
  onOpenViewer:          (file: { url: string; label: string }) => void;
  onUpdateDocumentDates: (
    documentId: number,
    data: { dateDebutValidite?: string; dateFinValidite?: string },
  ) => Promise<void>;
};

function toInputDate(iso?: string | null) {
  return iso ? iso.split('T')[0] : '';
}

function fmtDate(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function DocumentsAdherent({
  documents,
  demandeId,
  onOpenViewer,
  onUpdateDocumentDates,
}: Props) {
  const [editing, setEditing] = useState<Record<number, EditState>>({});
  const [saving,  setSaving]  = useState<Record<number, boolean>>({});
  const [saved,   setSaved]   = useState<Record<number, boolean>>({});
  const [saveErr, setSaveErr] = useState<Record<number, string | null>>({});

  if (!documents?.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center">
        <FileText className="mx-auto w-8 h-8 text-slate-300 mb-2" />
        <p className="text-sm text-slate-500">Aucun document disponible</p>
      </div>
    );
  }

  const grouped = TYPE_ORDER.reduce<Record<TypeDocument, DocumentAdherent[]>>(
    (acc, t) => {
      const docs = documents.filter((d) => d.typeDocument === t);
      if (docs.length) acc[t] = docs;
      return acc;
    },
    {} as Record<TypeDocument, DocumentAdherent[]>,
  );

  const uniqueTypes = TYPE_ORDER.filter((t) => grouped[t]);

  function startEdit(doc: DocumentAdherent) {
    setEditing((p) => ({
      ...p,
      [doc.id]: {
        dateDebutValidite: toInputDate(doc.dateDebutValidite),
        dateFinValidite:   toInputDate(doc.dateFinValidite),
      },
    }));
    setSaved((p)   => ({ ...p, [doc.id]: false }));
    setSaveErr((p) => ({ ...p, [doc.id]: null }));
  }

  function cancelEdit(docId: number) {
    setEditing((p) => { const n = { ...p }; delete n[docId]; return n; });
  }

  async function saveEdit(doc: DocumentAdherent) {
    const state = editing[doc.id];
    if (!state) return;
    setSaving((p)  => ({ ...p, [doc.id]: true }));
    setSaveErr((p) => ({ ...p, [doc.id]: null }));
    try {
      await onUpdateDocumentDates(doc.id, {
        dateDebutValidite: state.dateDebutValidite || undefined,
        dateFinValidite:   state.dateFinValidite   || undefined,
      });
      setSaved((p) => ({ ...p, [doc.id]: true }));
      cancelEdit(doc.id);
    } catch (err: any) {
      setSaveErr((p) => ({ ...p, [doc.id]: err.message ?? 'Erreur' }));
    } finally {
      setSaving((p) => ({ ...p, [doc.id]: false }));
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Documents ({documents.length})
      </h2>

      <div className="space-y-3">
        {uniqueTypes.map((type) => {
          const docs       = grouped[type];
          const doc        = docs[0];
          const isEditable = EDITABLE_TYPES.includes(type);
          const isEditing  = Boolean(editing[doc.id]);
          const isSaving   = saving[doc.id];
          const wasSaved   = saved[doc.id];
          const errMsg     = saveErr[doc.id];

          return (
            <div key={type} className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">

              {/* En-tête */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">{LABEL[type]}</span>
                  <StatutBadge statut={doc.statut} />
                  {wasSaved && (
                    <span className="text-[10px] text-green-600 font-medium">✓ Sauvegardé</span>
                  )}
                </div>
                {isEditable && !isEditing && (
                  <button
                    onClick={() => startEdit(doc)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-500 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Modifier les dates
                  </button>
                )}
              </div>

              {/* Dates (lecture) */}
              {!isEditing && (doc.dateDebutValidite || doc.dateFinValidite) && (
                <div className="flex flex-wrap gap-4">
                  {doc.dateDebutValidite && (
                    <DateChip label="Début" value={fmtDate(doc.dateDebutValidite)} />
                  )}
                  {doc.dateFinValidite && (
                    <DateChip label="Fin"   value={fmtDate(doc.dateFinValidite)} />
                  )}
                </div>
              )}

              {/* Formulaire édition dates */}
              {isEditing && (
                <div className="grid sm:grid-cols-2 gap-3 p-3 rounded-lg border border-orange-200 bg-orange-50">
                  <DateField
                    label="Date de début"
                    value={editing[doc.id].dateDebutValidite}
                    onChange={(v) =>
                      setEditing((p) => ({ ...p, [doc.id]: { ...p[doc.id], dateDebutValidite: v } }))
                    }
                  />
                  <DateField
                    label="Date de fin"
                    value={editing[doc.id].dateFinValidite}
                    onChange={(v) =>
                      setEditing((p) => ({ ...p, [doc.id]: { ...p[doc.id], dateFinValidite: v } }))
                    }
                  />
                  {errMsg && (
                    <p className="sm:col-span-2 text-xs text-red-500">{errMsg}</p>
                  )}
                  <div className="sm:col-span-2 flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => cancelEdit(doc.id)}
                      disabled={isSaving}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" /> Annuler
                    </button>
                    <button
                      onClick={() => saveEdit(doc)}
                      disabled={isSaving}
                      className="flex items-center gap-1.5 text-xs text-white bg-orange-500 hover:bg-orange-600 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-60"
                    >
                      {isSaving
                        ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <Save className="w-3.5 h-3.5" />
                      }
                      {isSaving ? 'Sauvegarde…' : 'Sauvegarder'}
                    </button>
                  </div>
                </div>
              )}

              {/* Fichiers */}
              <div className="flex flex-wrap gap-2">
                {docs.flatMap((d, di) =>
                  (d.fichiers ?? []).map((f, fi) => {
                    const fileUrl   = buildDocumentUrl(f.cheminFichier);
                    const fileIndex = di + fi + 1;
                    const showIndex = docs.length > 1 || (d.fichiers?.length ?? 0) > 1;
                    return (
                      <button
                        key={f.id}
                        onClick={() =>
                          onOpenViewer({
                            url:   fileUrl,
                            label: showIndex ? `${LABEL[type]} — fichier ${fileIndex}` : LABEL[type],
                          })
                        }
                        className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 hover:bg-orange-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {showIndex ? `Fichier ${fileIndex}` : 'Voir le fichier'}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Méta */}
              <p className="text-[10px] text-slate-400">
                Document #{doc.id} · Modifié le {new Date(doc.dateModification).toLocaleDateString('fr-FR')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatutBadge({ statut }: { statut?: string | null }) {
  if (!statut) return null;
  const ok = statut === 'VALIDE';
  return (
    <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
      ok
        ? 'bg-green-50 text-green-600 border-green-200'
        : 'bg-orange-50 text-orange-500 border-orange-200'
    }`}>
      {ok ? <CheckCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
      {ok ? 'Validé' : 'En attente'}
    </span>
  );
}

function DateChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
      <span className="text-slate-400">{label} :</span>
      <span className="text-slate-600 font-medium">{value}</span>
    </div>
  );
}

function DateField({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] text-slate-500 uppercase tracking-wide block mb-1">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
      />
    </div>
  );
}