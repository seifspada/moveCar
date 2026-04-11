// components/admin-components/Demande-component/DemandeList.tsx
'use client';

import { Demande } from '@/app/hooks/useDemande';
import { DemandeCard } from './DemandeCard';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

type FilterType = 'all' | 'adherent' | 'partenaire';

const PAGE_SIZE = 10;

interface Props {
  demandes: Demande[];
  fixedType?: FilterType;
}

export function DemandeList({ demandes, fixedType }: Props) {
  const [filterType, setFilterType] = useState<FilterType>(fixedType ?? 'all');
  const [search, setSearch]         = useState('');
  const [page,   setPage]           = useState(1);

  const filtered = useMemo(() =>
    demandes.filter((d) => {
      const matchType   = filterType === 'all' || d.type === filterType;
      const matchSearch = d.email.toLowerCase().includes(search.toLowerCase())
                       || (d.message ?? '').toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    }),
    [demandes, filterType, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const typeTabs: { key: FilterType; label: string; count: number }[] = [
    { key: 'all',        label: 'Tous',       count: demandes.length },
    { key: 'adherent',   label: 'Adhérent',   count: demandes.filter((d) => d.type === 'adherent').length },
    { key: 'partenaire', label: 'Partenaire', count: demandes.filter((d) => d.type === 'partenaire').length },
  ];

  const pageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    return [1, 2, 3, '...', totalPages];
  };

  return (
    <div>

      {/* ── Tabs type — masqués si fixedType est défini (page gère déjà le filtre) ── */}
      {!fixedType && (
        <div className="flex gap-1 px-5 pt-5 border-b border-zinc-800">
          {typeTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setFilterType(tab.key); setPage(1); }}
              className={`pb-3 px-1 mr-4 text-sm font-medium border-b-2 transition-colors ${
                filterType === tab.key
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                filterType === tab.key ? 'bg-blue-950 text-blue-400' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Search ── */}
      <div className="px-5 py-4">
        <div className="relative w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Rechercher email, nom..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-zinc-200 placeholder-zinc-600"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-zinc-800 bg-zinc-800/40">
              <th className="pl-5 pr-4 py-3 w-10" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email / Nom</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rôle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date & Heure</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📭</span>
                    <p className="text-sm text-zinc-600">Aucune demande trouvée</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((demande, i) => (
                <DemandeCard
                  key={demande.id}
                  demande={demande}
                  index={(page - 1) * PAGE_SIZE + i + 1}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800">
        <p className="text-sm text-zinc-600">
          {filtered.length === 0
            ? '0 résultat'
            : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} sur ${filtered.length}`}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Précédent
          </button>
          {pageNumbers().map((p, i) =>
            p === '...' ? (
              <span key={`e-${i}`} className="px-2 text-zinc-600 text-sm">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
                  page === p ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {p}
              </button>
            ),
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Suivant
          </button>
        </div>
      </div>

    </div>
  );
}