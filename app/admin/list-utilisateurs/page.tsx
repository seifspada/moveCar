'use client';

import { useState } from 'react';
import { useUsers } from "@/app/hooks/useUsers";
import { UserList } from "@/components/admin-components/utilisateur-component/UserList";
import { UserStats } from "@/components/admin-components/utilisateur-component/UserStats";
import { RoleModal } from '@/components/admin-components/Role-component/Rolemodal';

export default function UsersPage() {
  const { users, loading, error, refetch } = useUsers();
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const count = (role: string) => users.filter((u) => u.role.name === role).length;

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-white">Utilisateurs</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Gestion des comptes et des rôles</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRoleModalOpen(true)}
              className="text-xs text-zinc-300 hover:text-white transition-colors px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg flex items-center gap-1.5"
            >
              <span className="text-blue-400">⊕</span> Rôles
            </button>
            <button
              onClick={refetch}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 bg-zinc-800 rounded-lg"
            >
              ↺ Actualiser
            </button>
          </div>
        </div>

        <UserStats
          total={users.length}
          admins={count('admin')}
          adherents={count('adherent')}
          partenaires={count('partenaire')}
          agents={count('agent')}
        />

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-zinc-500">Chargement...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-2">
              <span className="text-4xl">⚠️</span>
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={refetch}
                className="mt-2 text-xs text-zinc-400 hover:text-white underline"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <UserList users={users} />
          )}
        </div>
      </div>

      <RoleModal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} />
    </div>
  );
}