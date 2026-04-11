'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Rendezvous, StatutDemande } from "@/app/types/rendezvous";
import { AccepterDemandeModal } from '../Demande-accepter/AccepterDemandeModal';

// ===================== CONFIG =====================

const statutDemandeConfig: Record<StatutDemande, { label: string; className: string }> = {
  EN_ATTENTE:          { label: 'En attente', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  EN_COURS_TRAITEMENT: { label: 'En cours',   className: 'bg-orange-50 text-orange-700 border-orange-200' },
  ACCEPTEE:            { label: 'Acceptée',   className: 'bg-green-50 text-green-700 border-green-200' },
  REFUSEE:             { label: 'Refusée',    className: 'bg-red-50 text-red-700 border-red-200' },
};

const typeRdvConfig: Record<string, { icon: string; label: string }> = {
  VISIO:        { icon: '💻', label: 'Visioconférence' },
  PRESENTIEL:   { icon: '📍', label: 'Présentiel' },
  PHYSIQUE:     { icon: '📍', label: 'Présentiel' },
  TELEPHONIQUE: { icon: '📞', label: 'Téléphonique' },
};

// ===================== SOUS-COMPOSANTS =====================

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${className}`}>
      {label}
    </span>
  );
}

function InfoRow({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-gray-600">
      <span className="text-base shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

// ===================== PROPS =====================

interface Props {
  rdv:        Rendezvous;
  onRefuse?:  (id: number, motif?: string) => Promise<void>;
  onRefetch?: () => void;
}

// ===================== COMPOSANT PRINCIPAL =====================

export function RendezvousCard({ rdv, onRefuse, onRefetch }: Props) {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [confirmRefuse,   setConfirmRefuse]   = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [motif,           setMotif]           = useState('');

  // ✅ Log temporaire — retirer après vérification
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 rdv complet:', JSON.stringify(rdv, null, 2));
  }

  // ✅ Résolution robuste de l'ID de la demande partenaire
  // Priorité : demandePartenaireId → demandeId → id
  const demandePartennaireId: number =
    (rdv as any).demandePartenaireId ??
    (rdv as any).demandeId           ??
    rdv.id;

  const dateFormatted = new Date(rdv.dateRdv).toLocaleDateString('fr-FR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

  const demandeBadge = statutDemandeConfig[rdv.statutDemande] ?? {
    label: rdv.statutDemande, className: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  const typeInfo = typeRdvConfig[rdv.typeRdv] ?? {
    icon: '📋', label: rdv.typeRdv,
  };

  const peutAgir = ['EN_ATTENTE', 'EN_COURS_TRAITEMENT'].includes(rdv.statutDemande);

  const handleRefuse = async () => {
    if (!onRefuse) return;
    setLoading(true);
    try {
      await onRefuse(rdv.id, motif || undefined);
    } finally {
      setLoading(false);
      setConfirmRefuse(false);
      setMotif('');
    }
  };

  return (
    <>
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm
                      hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">

        {/* ── Overlay refus avec motif ── */}
        {confirmRefuse && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-10
                          flex flex-col items-center justify-center gap-3 px-6">
            <p className="text-sm text-gray-700 text-center font-medium">
              Refuser la demande de <span className="font-bold">{rdv.nom}</span> ?
            </p>
            <textarea
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Motif du refus (optionnel)..."
              rows={3}
              className="w-full text-xs text-gray-700 bg-gray-50 border border-gray-200
                         rounded-xl px-3 py-2 resize-none focus:outline-none
                         focus:ring-2 focus:ring-red-200"
            />
            <div className="flex gap-3 w-full">
              <button
                onClick={() => { setConfirmRefuse(false); setMotif(''); }}
                disabled={loading}
                className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100
                           hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleRefuse}
                disabled={loading}
                className="flex-1 py-2 text-sm font-semibold text-white bg-red-500
                           hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50
                           flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refuser'}
              </button>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate text-base leading-tight">{rdv.nom}</p>
            <p className="text-sm text-gray-400 truncate mt-0.5">{rdv.entite}</p>
            {/* ✅ Debug visible en dev */}
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-gray-300 mt-0.5">
                rdv.id={rdv.id} | demandeId={demandePartennaireId}
              </p>
            )}
          </div>
          <Badge label={demandeBadge.label} className={demandeBadge.className} />
        </div>

        <div className="mx-5 border-t border-gray-100" />

        {/* ── Body ── */}
        <div className="px-5 py-4 flex flex-col gap-3 flex-1">
          <InfoRow icon="✉️">
            <a href={`mailto:${rdv.email}`}
               className="text-blue-500 hover:underline truncate block max-w-[200px]">
              {rdv.email}
            </a>
          </InfoRow>
          <InfoRow icon="📅">
            <span className="capitalize text-gray-700">{dateFormatted}</span>
          </InfoRow>
          <InfoRow icon="🕐">
            <span className="font-semibold text-gray-800">{rdv.creneau}</span>
          </InfoRow>
          <InfoRow icon={typeInfo.icon}>
            <span className="text-gray-700">{typeInfo.label}</span>
            {rdv.lienVisio && (
              <a href={rdv.lienVisio} target="_blank" rel="noopener noreferrer"
                 className="ml-2 text-blue-500 hover:underline text-xs font-medium">
                → Rejoindre
              </a>
            )}
            {rdv.adresse && (
              <span className="ml-2 text-gray-400 text-xs truncate">{rdv.adresse}</span>
            )}
          </InfoRow>
        </div>

        {/* ── Footer boutons ── */}
        {peutAgir && (
          <div className="px-5 py-3 border-t border-gray-100 flex gap-2">

            <button
              onClick={() => setShowAcceptModal(true)}
              disabled={confirmRefuse}
              className="flex-1 flex items-center justify-center gap-1.5 py-2
                         text-xs font-semibold text-emerald-600
                         bg-emerald-50 hover:bg-emerald-100
                         border border-emerald-200 rounded-xl
                         transition-colors disabled:opacity-40"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Accepter
            </button>

            {onRefuse && (
              <button
                onClick={() => setConfirmRefuse(true)}
                disabled={confirmRefuse}
                className="flex-1 flex items-center justify-center gap-1.5 py-2
                           text-xs font-semibold text-red-500
                           bg-red-50 hover:bg-red-100
                           border border-red-200 rounded-xl
                           transition-colors disabled:opacity-40"
              >
                <XCircle className="w-3.5 h-3.5" />
                Refuser
              </button>
            )}

          </div>
        )}

      </div>

      {/* ✅ Modal EN DEHORS du div card */}
      {showAcceptModal && (
        <AccepterDemandeModal
          demandeId={demandePartennaireId}  // ✅ ID résolu avec fallback
          nomPartenaire={`${rdv.nom} — ${rdv.entite}`}
          onClose={() => setShowAcceptModal(false)}
          onSuccess={() => {
            setShowAcceptModal(false);
            onRefetch?.();
          }}
        />
      )}
    </>
  );
}