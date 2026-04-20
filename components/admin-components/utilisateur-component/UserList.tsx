'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { UserCard } from './UserCard';
import { User } from '@/app/types/user';

type RoleFilter = 'all' | 'admin' | 'adherent' | 'partenaire' | 'agent';

interface Props {
  users: User[];
  fixedRole?: RoleFilter;
}

const PAGE_SIZE = 10;

export function UserList({ users, fixedRole }: Props) {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(fixedRole ?? 'all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const matchRole = roleFilter === 'all' || u.role.name === roleFilter;
        const matchSearch =
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase());
        return matchRole && matchSearch;
      }),
    [users, roleFilter, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const roleTabs: { key: RoleFilter; label: string }[] = [
    { key: 'all', label: 'Tous' },
    { key: 'admin', label: 'Admin' },
    { key: 'adherent', label: 'Adhérent' },
    { key: 'partenaire', label: 'Partenaire' },
    { key: 'agent', label: 'Agent' },
  ];

  const countByRole = (key: RoleFilter) =>
    key === 'all' ? users.length : users.filter((u) => u.role.name === key).length;

  const pageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    return [1, 2, 3, '...', totalPages];
  };

  return (
    <div>
      {!fixedRole && (
        <div className="flex border-b border-zinc-800 px-5 pt-4">
          {roleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setRoleFilter(tab.key);
                setPage(1);
              }}
              className={`pb-3 px-1 mr-6 text-sm font-medium border-b-2 transition-colors ${
                roleFilter === tab.key
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  roleFilter === tab.key ? 'bg-blue-950 text-blue-400' : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {countByRole(tab.key)}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="px-5 py-4">
        <div className="relative w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Rechercher nom, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-zinc-200 placeholder-zinc-600"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-zinc-800 bg-zinc-800/40">
              <th className="pl-5 pr-4 py-3 w-10" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rôle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Créé le</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Mis à jour</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">👤</span>
                    <p className="text-sm text-zinc-600">Aucun utilisateur trouvé</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((user, i) => (
                <UserCard key={user.id} user={user} index={(page - 1) * PAGE_SIZE + i + 1} />
              ))
            )}
          </tbody>
        </table>
      </div>

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