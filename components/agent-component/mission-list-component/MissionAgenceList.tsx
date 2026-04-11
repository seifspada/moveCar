'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle, RefreshCw, Search, Rocket } from 'lucide-react';
import { useMissionsByAgence } from '@/app/hooks/useMissionsByAgence';
import MissionAgenceCard from './MissionAgenceCard';
import MissionToolbar from './MissionToolBar';

interface MissionAgenceListProps {
  agenceId: number;
  onAddMission: () => void;
}

export default function MissionAgenceList({ agenceId, onAddMission }: MissionAgenceListProps) {
  const [search, setSearch] = useState('');
  const { missions, loading, error, refetch } = useMissionsByAgence(agenceId);

  // ✅ Filtrage local par ville départ ou arrivée
  const filtered = useMemo(() => {
    if (!search.trim()) return missions;
    const q = search.toLowerCase();
    return missions.filter(
      (m) =>
        m.villeDepart.toLowerCase().includes(q) ||
        m.villeArrivee.toLowerCase().includes(q)
    );
  }, [missions, search]);

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
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2">
                  <div className="w-4 bg-zinc-800 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-3 bg-zinc-800 rounded-full w-24" />
                    <div className="h-3 bg-zinc-800 rounded-full w-20" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-zinc-800 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-zinc-800 rounded-lg" />
                ))}
              </div>
              <div className="h-px bg-zinc-800 mb-3" />
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-zinc-800 rounded-md" />
                  <div className="h-6 w-16 bg-zinc-800 rounded-md" />
                </div>
                <div className="h-4 w-24 bg-zinc-800 rounded-full" />
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
        <p className="text-sm font-medium text-zinc-400 mb-4">{error.message}</p>
        <button
          onClick={() => refetch()}
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
  if (missions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center
                      border border-dashed border-zinc-800 rounded-2xl">
        <div className="w-20 h-20 rounded-2xl bg-orange-600/10 border border-orange-600/20
                        flex items-center justify-center mb-5">
          <Rocket className="w-9 h-9 text-orange-600/50" />
        </div>
        <h3 className="font-semibold text-zinc-400 text-base mb-1">
          Aucune mission pour le moment
        </h3>
        <p className="text-sm text-zinc-600 mb-5">
          Cliquez sur &quot;Nouvelle mission&quot; pour commencer
        </p>
        <button
          onClick={onAddMission}
          className="flex items-center gap-2 text-xs font-medium
                     px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500
                     text-white transition-all duration-200"
        >
          + Nouvelle mission
        </button>
      </div>
    );
  }

  // ─── Liste ─────────────────────────────────────────────────────────────────
  return (
    <div>
      <MissionToolbar
        missions={missions}
        filteredCount={filtered.length}
        search={search}
        onSearch={setSearch}
        onAddMission={onAddMission}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center
                        border border-dashed border-zinc-800 rounded-2xl">
          <Search className="w-8 h-8 text-zinc-700 mb-3" />
          <p className="text-sm text-zinc-500 mb-1">
            Aucune mission ne correspond à &quot;
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
          {filtered.map((mission) => (
            <MissionAgenceCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}
    </div>
  );
}