'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { STATUT_CONFIG } from '@/app/types/partenaire';
import { useDemandePartenaire } from '@/app/hooks/useDemandePartenaire';
import { DetailHero }     from '@/components/admin-components/Demande-details/DetailHero';
import { InfoContact }    from '@/components/admin-components/Demande-details/InfoContact';
import { InfoActivite }   from '@/components/admin-components/Demande-details/InfoActivate';
import { InfoRendezvous } from '@/components/admin-components/Demande-details/InfoRendezvous';
import { ActionButtons }  from '@/components/admin-components/ActionButtons';

export default function DemandePartenaireDetailPage() {
  const params = useParams();
  const router = useRouter();

  // ✅ Extraire et valider l'id avant de passer au hook
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const {
    demande,
    loading,
    error,
    confirmer,
    refuser,
    reporter,
    actionLoading,
    actionError,
  } = useDemandePartenaire(id);

  // ✅ Guard — id manquant ou invalide
  if (!id || id === 'undefined') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-slate-600 font-medium">ID de la demande manquant</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm text-orange-500 hover:underline"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    </div>
  );

  // ── Erreur ───────────────────────────────────────────
  if (error || !demande) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">❌</p>
        <p className="text-slate-600 font-medium">{error || 'Demande introuvable'}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-orange-500 hover:underline"
        >
          ← Retour
        </button>
      </div>
    </div>
  );

  const statut = STATUT_CONFIG[demande.statutDemande] ?? {
    label: demande.statutDemande,
    color: 'text-slate-600',
    bg:    'bg-slate-50 border-slate-200',
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-slate-800 border-b border-orange-500/30 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">Demande #{demande.id}</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statut.bg} ${statut.color}`}>
              {statut.label}
            </span>
          </div>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        <DetailHero demande={demande} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoContact  demande={demande} />
          <InfoActivite demande={demande} />
        </div>

        {demande.rendezvous && (
          <InfoRendezvous rendezvous={demande.rendezvous} />
        )}

        <ActionButtons
          statutDemande={demande.statutDemande}
          confirmer={confirmer}
          refuser={refuser}
          reporter={reporter}
          actionLoading={actionLoading}
          actionError={actionError}
          actionableStatuts={['EN_ATTENTE', 'EN_COURS_TRAITEMENT']}
        />

      </div>
    </div>
  );
}