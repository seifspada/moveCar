// app/admin/demande-refuser/page.tsx
'use client';

import { useDemandesRefusees } from '@/app/hooks/useDemandesRefusee';
import { DemandeList }         from '@/components/admin-components/Demande-component/DemandeList';
import { Loader2, RefreshCw }  from 'lucide-react';

export default function DemandesRefuseesPage() {
  const { demandes, loading, error, stats, refetch } = useDemandesRefusees();

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <h1 className="text-2xl font-bold text-white">Demandes Refusées</h1>
            <span className="text-sm text-zinc-500">{stats.total} demandes</span>
          </div>
          <button
            onClick={refetch}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <RefreshCw size={14} />
            Actualiser
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-5">
          <div className="bg-zinc-900 rounded-xl px-5 py-3 flex items-center gap-3 border border-zinc-800">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-zinc-500">Total refusées</p>
          </div>
          <div className="bg-zinc-900 rounded-xl px-5 py-3 flex items-center gap-3 border border-red-500/20">
            <p className="text-2xl font-bold text-red-400">{stats.adherents}</p>
            <p className="text-xs text-zinc-500">Adhérents refusés</p>
          </div>
          <div className="bg-zinc-900 rounded-xl px-5 py-3 flex items-center gap-3 border border-red-500/20">
            <p className="text-2xl font-bold text-red-400">{stats.partenaires}</p>
            <p className="text-xs text-zinc-500">Partenaires refusés</p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
              <p className="text-sm text-zinc-500">Chargement...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-zinc-900 rounded-2xl border border-red-900/40 flex items-center justify-center py-24">
            <p className="text-sm text-red-400">❌ {error}</p>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800">
            <DemandeList
              demandes={demandes}
              fixedType="all" // ✅ remplace fixedStatut — masque les tabs internes
            />
          </div>
        )}

      </div>
    </div>
  );
}