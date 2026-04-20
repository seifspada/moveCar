// app/agent/reservations-mission-list/[id]/components/ReservationListHeader.tsx
'use client';

import { useRouter } from 'next/navigation';

interface Props {
  missionId: string;
  total: number;
  villeDepart?: string;
  villeArrivee?: string;
  filter: string;
  onFilterChange: (f: string) => void;
}

// ✅ FIX: CONFIRMEE → ACCEPTED_BY_AGENT + CONFIRMED_BY_ADHERENT + ANNULATION_DEMANDEE
const FILTERS = [
  { value: 'ALL',                   label: 'Toutes' },
  { value: 'EN_ATTENTE',            label: 'En attente' },
  { value: 'ACCEPTED_BY_AGENT',     label: 'Acceptées' },
  { value: 'CONFIRMED_BY_ADHERENT', label: 'Confirmées' },
  { value: 'ANNULATION_DEMANDEE',   label: 'Annul. demandée' },
  { value: 'REFUSEE',               label: 'Refusées' },
  { value: 'ANNULEE',               label: 'Annulées' },
];

export default function ReservationListHeader({
  missionId,
  total,
  villeDepart,
  villeArrivee,
  filter,
  onFilterChange,
}: Props) {
  const router = useRouter();

  return (
    <div className="mb-6 space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 hover:border-orange-500 flex items-center justify-center transition-all duration-200"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-white font-bold text-lg leading-tight">
              Réservations
            </h1>
            {villeDepart && villeArrivee && (
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-green-400 font-medium">{villeDepart}</span>
                <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="text-orange-400 font-medium">{villeArrivee}</span>
              </div>
            )}
            <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs px-2 py-0.5 rounded-full font-medium">
              {total} résultat{total > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-zinc-500 text-xs mt-0.5 truncate">
            Mission ID: {missionId}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              filter === f.value
                ? 'bg-orange-500 text-black'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-orange-500/50 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}