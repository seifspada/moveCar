// components/adherent-component/reservation-components/ReservationStatusBadge.tsx
'use client';

interface Props {
  statut: string;
  size?: 'sm' | 'md';
}

const STATUT_CONFIG: Record<string, { label: string; classes: string; dot: string; pulse?: boolean }> = {
  EN_ATTENTE: {
    label: 'En attente',
    classes: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    dot: 'bg-yellow-400',
    pulse: true,
  },
  ACCEPTED_BY_AGENT: {
    label: 'À confirmer',          // ✅ raccourci — plus court
    classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    dot: 'bg-blue-400',
    pulse: true,
  },
  CONFIRMED_BY_ADHERENT: {
    label: 'Confirmée',
    classes: 'bg-green-500/10 text-green-400 border border-green-500/30',
    dot: 'bg-green-400',
  },
  ANNULATION_DEMANDEE: {
    label: 'Annul. demandée',
    classes: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
    dot: 'bg-orange-400',
    pulse: true,
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
    pulse: true,
  },
};

const DEFAULT = {
  label: 'Inconnu',
  classes: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/30',
  dot: 'bg-zinc-400',
};

export default function ReservationStatusBadge({ statut, size = 'md' }: Props) {
  const config = STATUT_CONFIG[statut] ?? DEFAULT;
  const textSize = size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${config.classes} ${textSize}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot} ${config.pulse ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
}