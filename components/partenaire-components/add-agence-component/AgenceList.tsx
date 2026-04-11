'use client';

import AgenceCard from './AgenceCard';
import AgenceToolbar from './AgenceToolbar';
import AgenceDrawer from './AgenceDrawer';
import ChangeAgentModal from './ChangeAgentModal';
import { Building2, AlertTriangle, RefreshCw, Search } from 'lucide-react';
import { useAgences } from '@/app/hooks/useAgences';

interface AgenceListProps {
  refreshTrigger: number;
}

export default function AgenceList({ refreshTrigger }: AgenceListProps) {
  const {
    agences,
    filtered,
    loading,
    error,
    search,
    setSearch,
    selectedAgence,
    setSelectedAgence,
    changeAgentAgence,
    setChangeAgentAgence,
    fetchAgences,
  } = useAgences(refreshTrigger);

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <div className="h-7 w-24 bg-zinc-800 rounded-full animate-pulse" />
            <div className="h-7 w-20 bg-zinc-800 rounded-full animate-pulse" />
          </div>
          <div className="h-8 w-48 bg-zinc-800 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-zinc-800 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-zinc-800 rounded-full w-3/4" />
                  <div className="h-2 bg-zinc-800 rounded-full w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-zinc-800 rounded-lg" />
                <div className="h-8 bg-zinc-800 rounded-lg w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Erreur ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20
                        flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <p className="text-sm font-medium text-zinc-400 mb-4">{error}</p>
        <button
          onClick={fetchAgences}
          className="flex items-center gap-2 text-xs text-orange-500 px-4 py-2
                     rounded-lg border border-orange-600/20 hover:bg-orange-600/10
                     transition-all duration-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Réessayer
        </button>
      </div>
    );
  }

  // ─── Vide ──────────────────────────────────────────────────────────────────
  if (agences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center
                      border border-dashed border-zinc-800 rounded-2xl">
        <div className="w-20 h-20 rounded-2xl bg-orange-600/10 border border-orange-600/20
                        flex items-center justify-center mb-5">
          <Building2 className="w-9 h-9 text-orange-600/50" />
        </div>
        <h3 className="font-semibold text-zinc-400 text-base mb-1">
          Aucune agence pour le moment
        </h3>
        <p className="text-sm text-zinc-600">
          Cliquez sur &quot;Nouvelle agence&quot; pour commencer
        </p>
      </div>
    );
  }

  // ─── Liste ─────────────────────────────────────────────────────────────────
  return (
    <>
      <AgenceDrawer
        agence={selectedAgence}
        isOpen={!!selectedAgence}
        onClose={() => setSelectedAgence(null)}
        onRefresh={fetchAgences}
        onChangeAgent={(agence) => {
          setSelectedAgence(null);
          setChangeAgentAgence(agence);
        }}
      />

      <ChangeAgentModal
        agenceId={changeAgentAgence?.id ?? 0}
        agenceNom={changeAgentAgence?.nom ?? ''}
        isOpen={!!changeAgentAgence}
        onClose={() => setChangeAgentAgence(null)}
        onSuccess={() => {
          setChangeAgentAgence(null);
          fetchAgences();
        }}
      />

      <div>
        <AgenceToolbar
          agences={agences}
          filteredCount={filtered.length}
          search={search}
          onSearch={setSearch}
        />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center
                          border border-dashed border-zinc-800 rounded-2xl">
            <Search className="w-8 h-8 text-zinc-700 mb-3" />
            <p className="text-sm text-zinc-500 mb-1">
              Aucune agence ne correspond à &quot;
              <span className="text-zinc-300">{search}</span>&quot;
            </p>
            <button
              onClick={() => setSearch('')}
              className="text-xs text-orange-500 hover:text-orange-400 mt-2 transition-colors"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((agence) => (
              <AgenceCard
                key={agence.id}
                agence={agence}
                onSelect={setSelectedAgence}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
