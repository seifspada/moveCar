// app/agent/reservations-mission-list/[id]/components/ReservationStatBadge.tsx
'use client';

interface Props {
  statut: string;
  size?: 'sm' | 'md';
}

const STATUT_CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  EN_ATTENTE: {
    label: 'En attente',
    classes: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    dot: 'bg-yellow-400',
  },
  // ✅ FIX: CONFIRMEE → 2 nouveaux statuts
  ACCEPTED_BY_AGENT: {
    label: 'Acceptée',
    classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    dot: 'bg-blue-400',
  },
  CONFIRMED_BY_ADHERENT: {
    label: 'Confirmée',
    classes: 'bg-green-500/10 text-green-400 border border-green-500/30',
    dot: 'bg-green-400',
  },
  // ✅ Nouveau
  ANNULATION_DEMANDEE: {
    label: 'Annul. demandée',
    classes: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
    dot: 'bg-orange-400',
  },
  REFUSEE: {
    label: 'Refusée',
    classes: 'bg-red-500/10 text-red-400 border border-red-500/30',
    dot: 'bg-red-400',
  },
  ANNULEE: {
    label: 'Annulée',
    classes: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/30',
    dot: 'bg-zinc-400',
  },
  TERMINEE: {
    label: 'Terminée',
    classes: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    dot: 'bg-purple-400',
  },
  EN_COURS: {
    label: 'En cours',
    classes: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    dot: 'bg-cyan-400',
  },
};

const DEFAULT_CONFIG = {
  label: 'Inconnu',
  classes: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/30',
  dot: 'bg-zinc-400',
};

export default function ReservationStatBadge({ statut, size = 'md' }: Props) {
  const config = STATUT_CONFIG[statut] ?? DEFAULT_CONFIG;
  const textSize = size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';

  // ✅ animate-pulse uniquement pour les statuts "actifs"
  const shouldPulse = ['EN_ATTENTE', 'ACCEPTED_BY_AGENT', 'ANNULATION_DEMANDEE', 'EN_COURS'].includes(statut);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.classes} ${textSize}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${shouldPulse ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
}