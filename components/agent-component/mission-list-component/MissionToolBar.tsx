'use client';

import { Plus } from 'lucide-react';
import MissionSearch from './MissionSearch';
import { MissionDetails } from '@/app/types/mission';

interface MissionToolbarProps {
  missions: MissionDetails[];
  filteredCount: number;
  search: string;
  onSearch: (value: string) => void;
  onAddMission: () => void;
}

export default function MissionToolbar({
  missions,
  filteredCount,
  search,
  onSearch,
  onAddMission,
}: MissionToolbarProps) {
  const totalActive = missions.filter((m) => m.statut === 'EN_ATTENTE').length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      {/* Badges compteurs */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full
                         bg-zinc-800 border border-zinc-700 text-zinc-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          {missions.length} mission{missions.length > 1 ? 's' : ''}
        </span>

        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full
                         bg-emerald-500/10 border border-emerald-500/20
                         text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {totalActive} en attente
        </span>

        {search && (
          <span className="text-xs text-zinc-500">
            {filteredCount} résultat{filteredCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Droite : recherche + bouton */}
      <div className="flex items-center gap-3">
        <MissionSearch value={search} onChange={onSearch} />

        <button
          onClick={onAddMission}
          className="flex items-center gap-2 text-xs font-medium
                     px-4 py-2 rounded-xl
                     bg-orange-600 hover:bg-orange-500
                     text-white transition-all duration-200
                     shadow-lg shadow-orange-900/30"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouvelle mission
        </button>
      </div>
    </div>
  );
}