// app/admin/demande-adherent-details/[id]/page.tsx
'use client';

import { useState }          from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft }         from 'lucide-react';
import { STATUT_ADHERENT_CONFIG } from '@/app/types/adherent';
import { useDemandeAdherent }     from '@/app/hooks/useDemandeAdherent';
import { DetailHeroAdherent }     from '@/components/admin-components/Demande-details-adherent/DetailHeroAdherent';
import { InfoContactAdherent }    from '@/components/admin-components/Demande-details-adherent/InfoContactAdherent';
import { InfoEntrepriseAdherent } from '@/components/admin-components/Demande-details-adherent/InfoEntrepriseAdherent';
import { DocumentsAdherent }      from '@/components/admin-components/Demande-details-adherent/DocumentsAdherent';
import { ActionButtons }          from '@/components/admin-components/ActionButtons';
import { DocumentViewer } from '@/components/admin-components/Demande-details-adherent/DocumentViewer';

type ViewerFile = { url: string; label: string } | null;

export default function DemandeAdherentDetailPage() {
  const { id }  = useParams();
  const router  = useRouter();

  const {
    demande,
    loading,
    error,
    confirmer,
    refuser,
    actionLoading,
    actionError,
    refetch,
  } = useDemandeAdherent(id);

  const [viewer, setViewer] = useState<ViewerFile>(null);

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    </div>
  );

  // ── Erreur ──
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

  const statut = STATUT_ADHERENT_CONFIG[demande.statut] ?? {
    label: demande.statut,
    color: 'text-slate-600',
    bg:    'bg-slate-50 border-slate-200',
  };

// ✅ Utilise la route API Next.js (pas directement BACKEND)
async function handleUpdateDocumentDates(
  documentId: number,
  data: { dateDebutValidite?: string; dateFinValidite?: string },
) {
  const res = await fetch(
    `/api/adherent/demande-adherent/${demande!.id}/documents/${documentId}/dates`,
    {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
      credentials: 'include',
    },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || err.message || `Erreur ${res.status}`);
  }

  refetch?.();
}

  return (
    <>
      <div className="min-h-screen bg-slate-50">

        {/* ── Header sticky ── */}
        <div className="bg-slate-800 border-b border-orange-500/30 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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

        {/* ── Contenu principal ── */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">

            {/* ── Colonne gauche ── */}
            <div className="space-y-6">
              <DetailHeroAdherent demande={demande} statut={statut} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoContactAdherent    demande={demande} />
                <InfoEntrepriseAdherent demande={demande} />
              </div>

              <DocumentsAdherent
                documents={demande.documents}
                demandeId={demande.id}
                onOpenViewer={setViewer}
                onUpdateDocumentDates={handleUpdateDocumentDates}
              />
            </div>

            {/* ── Colonne droite sticky ── */}
            <div className="xl:sticky xl:top-[73px]">
              <ActionButtons
                statutDemande={demande.statut}
                confirmer={confirmer}
                refuser={refuser}
                actionLoading={actionLoading}
                actionError={actionError}
              />
            </div>

          </div>
        </div>
      </div>

      {/* ── Viewer document (modale) ── */}
      {viewer && (
        <DocumentViewer
          url={viewer.url}
          label={viewer.label}
          onClose={() => setViewer(null)}
        />
      )}
    </>
  );
}