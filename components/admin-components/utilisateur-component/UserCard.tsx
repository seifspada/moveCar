'use client';

import { User } from '@/app/types/user';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  user: User;
  index: number;
}

const ROLE_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  admin: {
    label: 'Admin',
    badge: 'bg-purple-950 text-purple-400 border border-purple-800',
    dot: 'bg-purple-400',
  },
  adherent: {
    label: 'Adhérent',
    badge: 'bg-emerald-950 text-emerald-400 border border-emerald-800',
    dot: 'bg-emerald-400',
  },
  partenaire: {
    label: 'Partenaire',
    badge: 'bg-blue-950 text-blue-400 border border-blue-800',
    dot: 'bg-blue-400',
  },
  agent: {
    label: 'Agent',
    badge: 'bg-orange-950 text-orange-400 border border-orange-800',
    dot: 'bg-orange-400',
  },
};

const FALLBACK_ROLE = {
  label: 'Inconnu',
  badge: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
  dot: 'bg-zinc-400',
};

function formatDate(value: string): string {
  const d = new Date(value);
  return isNaN(d.getTime())
    ? '—'
    : new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(d);
}

export function UserCard({ user, index }: Props) {
  const roleConfig = ROLE_CONFIG[user.role.name] ?? FALLBACK_ROLE;
  const router = useRouter();

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors group">
      <td className="pl-5 pr-4 py-3.5 w-10">
        <span className="text-sm text-zinc-600">{index}</span>
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300 flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap ${roleConfig.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${roleConfig.dot}`} />
          {roleConfig.label}
        </span>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="text-sm text-zinc-500">{formatDate(user.createdAt)}</span>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="text-sm text-zinc-500">{formatDate(user.updatedAt)}</span>
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => router.push(`/admin/users/${user.id}`)}
            className="p-1.5 text-zinc-600 hover:text-blue-400 hover:bg-blue-950/50 rounded-lg transition-colors"
            title="Voir"
          >
            <Eye size={14} />
          </button>
          <button
            className="p-1.5 text-zinc-600 hover:text-amber-400 hover:bg-amber-950/50 rounded-lg transition-colors"
            title="Modifier"
          >
            <Pencil size={14} />
          </button>
          <button
            className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-950/50 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}