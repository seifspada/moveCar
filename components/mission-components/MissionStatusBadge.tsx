// components/mission-components/MissionStatusBadge.tsx
'use client';

interface Props {
  statut: string;
  size?: 'sm' | 'md';
}

const STATUT_CONFIG: Record<string, { label: string; classes: string; dot: string; pulse?: boolean }> = {
  TOUS: {
    label: 'Tous',
    classes: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    dot: 'bg-yellow-400',
    pulse: true,
  },
  FAVORIE: {
    label: 'Favorie',
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

export default function MissionStatusBadge({ statut, size = 'md' }: Props) {
  const config = STATUT_CONFIG[statut] ?? DEFAULT;
  const textSize = size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${config.classes} ${textSize}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot} ${config.pulse ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
}