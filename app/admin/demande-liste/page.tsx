'use client';

import { useDemandes } from "@/app/hooks/useDemande";
import { DemandeList } from "@/components/admin-components/Demande-component/DemandeList";
import { DemandeStats } from "@/components/admin-components/Demande-component/DemandeStats";

export default function DemandesTempsReelPage() {
  const { demandes, connected, stats, clearAll } = useDemandes();

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">
                Requests Management
              </h1>
              <span className="text-sm text-zinc-500 font-normal">
                {stats.total} Requests
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm text-zinc-500">
                {connected ? 'Connecté' : 'Déconnecté'}
              </span>
            </div>
          </div>

          {demandes.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-zinc-600 hover:text-red-400 transition-colors"
            >
              Tout effacer
            </button>
          )}
        </div>

        {/* Stats */}
        <DemandeStats
          total={stats.total}
          adherents={stats.adherents}
          partenaires={stats.partenaires}
        />

        {/* Table container */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800">
          <DemandeList demandes={demandes} />
        </div>

      </div>
    </div>
  );
}