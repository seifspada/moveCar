// components/admin-components/Demande-component/DemandeCard.tsx
'use client';

import { Demande, StatutDemande } from '@/app/hooks/useDemande';
import { useRouter } from 'next/navigation';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface Props {
  demande: Demande;
  index: number;
}

const TYPE_CONFIG = {
  adherent: {
    label: 'Adhérent',
    badge: 'bg-emerald-950 text-emerald-400 border border-emerald-800',
    route: '/admin/demande-adherent-details',
  },
  partenaire: {
    label: 'Partenaire',
    badge: 'bg-blue-950 text-blue-400 border border-blue-800',
    route: '/admin/demande-partenaire-details',
  },
};

const STATUT_CONFIG: Record<StatutDemande, { label: string; classes: string; dot: string }> = {
  EN_ATTENTE:          { label: 'En attente',   classes: 'bg-orange-950 text-orange-400 border border-orange-800',    dot: 'bg-orange-400'  },
  EN_COURS_TRAITEMENT: { label: 'RDV confirmé', classes: 'bg-blue-950/60 text-blue-300 border border-blue-700',       dot: 'bg-blue-400'    },
  ACCEPTEE:            { label: 'Acceptée',     classes: 'bg-emerald-950 text-emerald-400 border border-emerald-800', dot: 'bg-emerald-400' },
  REFUSEE:             { label: 'Refusée',      classes: 'bg-red-950 text-red-400 border border-red-800',             dot: 'bg-red-400'     },
};

// ✅ Fonction robuste — ne plante jamais
function parseDate(value: unknown): Date {
  if (!value) return new Date();
  if (value instanceof Date) return isNaN(value.getTime()) ? new Date() : value;
  const d = new Date(value as string);
  return isNaN(d.getTime()) ? new Date() : d;
}

function formatDateTime(value: unknown): string {
  const d = parseDate(value);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(d);
}

export function DemandeCard({ demande, index }: Props) {
  const typeConfig   = TYPE_CONFIG[demande.type];
  const statutConfig = STATUT_CONFIG[demande.statut];
  const router       = useRouter();

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors group">

      {/* Index */}
      <td className="pl-5 pr-4 py-3.5 w-10">
        <span className="text-sm text-zinc-600">{index}</span>
      </td>

      {/* Email + message */}
      <td className="px-4 py-3.5 max-w-[200px]">
        <p className="text-sm text-zinc-200 truncate">{demande.email}</p>
        {demande.message && (
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{demande.message}</p>
        )}
      </td>

      {/* Rôle */}
      <td className="px-4 py-3.5">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap ${typeConfig.badge}`}>
          {typeConfig.label}
        </span>
      </td>

      {/* Statut */}
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap ${statutConfig.classes}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statutConfig.dot}`} />
          {statutConfig.label}
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="text-sm text-zinc-500">{formatDateTime(demande.receivedAt)}</span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => router.push(`${typeConfig.route}/${demande.realId}`)}
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