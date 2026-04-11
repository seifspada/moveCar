'use client';

import { MissionDetails } from '@/app/types/mission';
import { useRouter } from 'next/navigation';

interface MissionAgenceCardProps {
  mission: MissionDetails;
}

const STATUT_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  EN_ATTENTE:           { label: 'En attente',    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',  dot: 'bg-yellow-400 animate-pulse' },
  RESERVEE:             { label: 'Réservée',       color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',        dot: 'bg-blue-400' },
  RESERVATION_ANNULEE:  { label: 'Annulée',        color: 'bg-red-500/10 text-red-400 border-red-500/20',           dot: 'bg-red-400' },
  CONFIRMEE:            { label: 'Confirmée',      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  EN_COURS:             { label: 'En cours',       color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',  dot: 'bg-orange-400 animate-pulse' },
  ARRIVEE:              { label: 'Arrivée',        color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',  dot: 'bg-purple-400' },
};

export default function MissionAgenceCard({ mission }: MissionAgenceCardProps) {
  const router = useRouter();
  const statut = STATUT_CONFIG[mission.statut] ?? { label: mission.statut, color: 'bg-zinc-800 text-zinc-400 border-zinc-700', dot: 'bg-zinc-400' };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);

  return (
    <div
      onClick={() => router.push(`/agent/missions/${mission.id}`)}
      className="group relative bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden
                 cursor-pointer
                 hover:-translate-y-1 hover:border-orange-600/40 hover:shadow-2xl hover:shadow-black/50
                 transition-all duration-300"
    >
      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent
                      opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5">
        {/* Header : trajet + statut */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* Ville départ */}
            <div className="flex flex-col items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mb-1" />
              <span className="w-px h-6 bg-zinc-700" />
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-1" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-white/90 leading-tight">
                {mission.villeDepart}
              </span>
              <span className="text-sm font-semibold text-white/90 leading-tight">
                {mission.villeArrivee}
              </span>
            </div>
          </div>

          {/* Statut badge */}
          <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border ${statut.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statut.dot}`} />
            {statut.label}
          </span>
        </div>

        {/* Infos : distance, montant, date */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="px-2.5 py-1.5 rounded-lg bg-zinc-800/60 text-center">
            <p className="text-[10px] text-zinc-500 mb-0.5">Distance</p>
            <p className="text-xs font-semibold text-zinc-300">{mission.distanceKm} km</p>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-zinc-800/60 text-center">
            <p className="text-[10px] text-zinc-500 mb-0.5">Montant</p>
            <p className="text-xs font-semibold text-orange-400">{formatPrice(mission.montantTotal)}</p>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-zinc-800/60 text-center">
            <p className="text-[10px] text-zinc-500 mb-0.5">Péage</p>
            <p className="text-xs font-semibold text-zinc-300">{formatPrice(mission.fraisPeage)}</p>
          </div>
        </div>

        {/* Véhicule + Date */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 font-mono uppercase">
              {mission.typeVehicule}
            </span>
            <span className="text-[10px] px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 font-mono uppercase">
              {mission.typeCarburant}
            </span>
          </div>
          <span className="text-xs text-zinc-600 font-mono">
            {formatDate(mission.dateDebut)}
          </span>
        </div>
      </div>
    </div>
  );
}