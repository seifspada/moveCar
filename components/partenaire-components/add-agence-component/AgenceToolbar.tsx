'use client';

import AgenceSearch from './AgenceSearch';

interface Agence {
  id: number;
  nom: string;
  isActive: boolean;
}

interface AgenceToolbarProps {
  agences: Agence[];
  filteredCount: number;
  search: string;
  onSearch: (value: string) => void;
}

export default function AgenceToolbar({
  agences,
  filteredCount,
  search,
  onSearch,
}: AgenceToolbarProps) {
  const activeCount = agences.filter((a) => a.isActive).length;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">

      {/* Stats */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full
                        bg-zinc-800 border border-zinc-700 text-zinc-400">
          <span className="text-orange-500">◆</span>
          {agences.length} agence{agences.length > 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full
                        bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {activeCount} active{activeCount > 1 ? 's' : ''}
        </div>

        {/* Résultats filtrés */}
        {search && (
          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full
                          bg-zinc-800 border border-zinc-700 text-zinc-500">
            {filteredCount} résultat{filteredCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Recherche */}
      <AgenceSearch value={search} onChange={onSearch} />
    </div>
  );
}
