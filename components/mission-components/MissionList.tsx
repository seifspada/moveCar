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
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-[18px] border border-zinc-700/80 bg-zinc-900 p-3 shadow-[0_12px_28px_rgba(0,0,0,0.24)] sm:rounded-[22px] sm:p-4"
          >
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-full bg-zinc-700 sm:h-12 sm:w-12" />
                <div className="h-7 w-7 rounded-full bg-zinc-800 sm:h-8 sm:w-8" />
              </div>
              <div className="space-y-2">
                <div className="h-3.5 w-3/4 rounded-full bg-zinc-700 sm:h-4" />
                <div className="h-3.5 w-1/2 rounded-full bg-zinc-800 sm:h-4" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square rounded-xl bg-zinc-800" />
                <div className="aspect-square rounded-xl bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ✅ Onglets Toutes / Favoris — mode adhérent uniquement */}
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

      {/* ✅ Vide */}
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