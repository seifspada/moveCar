// components/mission-components/MissionList.tsx
'use client';

import { useState } from 'react';
import { MissionDetails } from "@/app/types/mission";
import MissionCard from "./MissionCard";
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

type Props = {
  missions: MissionDetails[];
  loading?: boolean;
  mode?: 'agent' | 'adherent';
  onMissionClick?: (missionId: string) => void;
};

// ✅ Skeleton qui reproduit exactement la structure visuelle de MissionCard
function MissionCardSkeleton() {
  return (
    <div className="relative min-h-[282px] w-full overflow-hidden rounded-[22px] border border-orange-500/15
                    bg-[linear-gradient(145deg,#18181b_0%,#111113_52%,#09090b_100%)]
                    p-2.5 pb-2 pt-3
                    shadow-[0_18px_45px_rgba(0,0,0,0.32),0_0_0_1px_rgba(255,255,255,0.04)]
                    sm:min-h-[340px] sm:rounded-[28px] sm:p-5 sm:pb-4 xl:min-h-[370px] xl:p-6 xl:pb-5">

      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* Coin coloré (même clipPath que la vraie card) */}
      <div
        className="absolute left-0 top-0 h-20 w-24 bg-zinc-700/60 sm:h-32 sm:w-36 xl:h-40 xl:w-44"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />

      {/* Icône véhicule — cercle */}
      <div className="absolute left-2.5 top-3 z-10 h-10 w-10 rounded-full bg-zinc-700/70 sm:left-5 sm:top-6 sm:h-16 sm:w-16 xl:left-6 xl:top-7 xl:h-20 xl:w-20" />

      {/* Bouton favori — cercle haut droite */}
      <div className="absolute right-2.5 top-3 z-20 h-7 w-7 rounded-full bg-zinc-800/70 sm:right-5 sm:top-6 sm:h-10 sm:w-10 xl:right-6 xl:top-7 xl:h-11 xl:w-11" />

      {/* Contenu */}
      <div className="relative z-10 flex h-full flex-col">

        {/* Zone villes */}
        <div className="min-h-[84px] pl-12 pr-8 sm:min-h-[116px] sm:pl-20 sm:pr-12 xl:min-h-[132px] xl:pl-24">
          <div className="flex flex-col items-center gap-1.5 pt-5 sm:pt-9 xl:pt-10">
            <div className="h-3 w-24 rounded-full bg-zinc-700/70 sm:h-4 sm:w-32" />
            <div className="h-3 w-20 rounded-full bg-zinc-800/70 sm:h-4 sm:w-28" />
          </div>
        </div>

        {/* Montant + Distance */}
        <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:mt-4 sm:gap-3">
          <div className="rounded-xl border border-orange-400/15 bg-orange-500/5 px-1.5 py-1.5 sm:rounded-2xl sm:px-3 sm:py-3 xl:px-4">
            <div className="mx-auto mb-1 h-2 w-8 rounded-full bg-zinc-700/50 sm:h-2.5 sm:w-10" />
            <div className="mx-auto h-4 w-12 rounded-full bg-zinc-700/60 sm:h-5 sm:w-16" />
          </div>
          <div className="rounded-xl border border-zinc-700/50 bg-zinc-950/40 px-1.5 py-1.5 sm:rounded-2xl sm:px-3 sm:py-3 xl:px-4">
            <div className="mx-auto mb-1 h-2 w-8 rounded-full bg-zinc-700/50 sm:h-2.5 sm:w-10" />
            <div className="mx-auto h-4 w-10 rounded-full bg-zinc-700/60 sm:h-5 sm:w-14" />
          </div>
        </div>

        {/* Véhicule + Carburant */}
        <div className="mt-3 grid gap-2.5 sm:mt-5 sm:gap-4 xl:mt-6">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="h-4 w-4 flex-none rounded bg-zinc-700/50 sm:h-6 sm:w-6" />
              <div className="h-3 w-14 rounded-full bg-zinc-700/50 sm:h-4 sm:w-20" />
            </div>
            <div className="flex items-center justify-end gap-1 sm:gap-3">
              <div className="h-4 w-4 flex-none rounded bg-zinc-700/50 sm:h-6 sm:w-6" />
              <div className="h-3 w-10 rounded-full bg-zinc-700/50 sm:h-4 sm:w-16" />
            </div>
          </div>

          {/* Date + Péage */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 sm:gap-4">
            <div className="flex items-start gap-1 sm:gap-3">
              <div className="mt-0.5 h-4 w-4 flex-none rounded bg-zinc-700/50 sm:h-5 sm:w-5" />
              <div className="space-y-1">
                <div className="h-3 w-16 rounded-full bg-zinc-700/50 sm:h-4 sm:w-20" />
                <div className="h-3 w-12 rounded-full bg-zinc-800/50 sm:h-4 sm:w-16" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="ml-auto h-2.5 w-12 rounded-full bg-zinc-800/50 sm:h-3 sm:w-16" />
              <div className="ml-auto h-3 w-10 rounded-full bg-zinc-700/50 sm:h-4 sm:w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MissionList({ missions, loading = false, mode = 'agent', onMissionClick }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const handleMissionClick = (missionId: string) => {
    if (onMissionClick) {
      onMissionClick(missionId);
      return;
    }
    if (mode === 'adherent') {
      router.push(`/adherent/mission-reservation/${missionId}`);
    } else {
      router.push(`/agent/reservations-mission-list/${missionId}`);
    }
  };

  const favoritesCount = missions.filter((m) => m.isFavori).length;

  const displayedMissions = activeTab === 'favorites'
    ? missions.filter((m) => m.isFavori)
    : missions;

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <MissionCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Onglets Toutes / Favoris — mode adhérent uniquement */}
      {mode === 'adherent' && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 border ${
              activeTab === 'all'
                ? 'bg-orange-500/15 text-orange-400 border-orange-500/40'
                : 'text-zinc-400 border-zinc-700/60 hover:border-zinc-500 hover:text-zinc-200'
            }`}
          >
            Toutes
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 border ${
              activeTab === 'favorites'
                ? 'bg-orange-500/15 text-orange-400 border-orange-500/40'
                : 'text-zinc-400 border-zinc-700/60 hover:border-zinc-500 hover:text-zinc-200'
            }`}
          >
            <Star
              className={`h-3.5 w-3.5 transition-all duration-200 ${
                activeTab === 'favorites'
                  ? 'fill-orange-400 text-orange-400'
                  : 'fill-transparent text-zinc-400'
              }`}
              strokeWidth={1.8}
            />
            Favoris
            {favoritesCount > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                activeTab === 'favorites'
                  ? 'bg-orange-500/20 text-orange-300'
                  : 'bg-zinc-800 text-zinc-400'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Vide */}
      {displayedMissions.length === 0 ? (
        <div className="py-16 text-center">
          {activeTab === 'favorites' ? (
            <>
              <Star className="mx-auto mb-4 h-16 w-16 text-zinc-600" strokeWidth={1.2} />
              <p className="text-lg font-medium text-gray-400">Aucun favori pour l&apos;instant</p>
              <p className="mt-2 text-sm text-gray-500">Cliquez sur l&apos;étoile d&apos;une mission pour l&apos;ajouter</p>
            </>
          ) : (
            <>
              <svg className="mx-auto mb-4 h-16 w-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium text-gray-400">Aucune mission trouvée</p>
              <p className="mt-2 text-sm text-gray-500">Ajustez vos filtres et réessayez</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-4">
          {displayedMissions.map((mission) => (
            <div key={mission.id} onClick={() => handleMissionClick(mission.id)} className="cursor-pointer">
              <MissionCard mission={mission} missionId={mission.id} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}