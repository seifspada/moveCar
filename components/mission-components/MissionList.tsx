// components/mission-components/MissionList.tsx
// ✅ Grid responsive: Mobile (2 col) → Tablet (3 col) → Desktop (4 col)

import { MissionDetails } from "@/app/types/mission";
import MissionCard from "./MissionCard";

type Props = {
  missions: MissionDetails[];
  loading?: boolean;
};

export default function MissionList({ missions, loading = false }: Props) {
  // État de chargement avec skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div 
            key={i} 
            className="min-h-[360px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl 
                       border border-zinc-700 p-4 sm:p-5 md:p-6 animate-pulse"
          >
            <div className="flex flex-col justify-between h-full space-y-4">
              {/* Top skeleton */}
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-zinc-700 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-700 rounded w-20"></div>
                  <div className="h-8 bg-zinc-700 rounded w-16"></div>
                </div>
                <div className="w-5 h-5 bg-zinc-700 rounded"></div>
              </div>
              
              {/* Middle skeleton */}
              <div className="space-y-2">
                <div className="h-5 bg-zinc-700 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
              </div>
              
              {/* Badges skeleton */}
              <div className="grid grid-cols-2 gap-2">
                <div className="h-12 bg-zinc-700 rounded"></div>
                <div className="h-12 bg-zinc-700 rounded"></div>
              </div>
              
              {/* Bottom skeleton */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 bg-zinc-700 rounded"></div>
                  <div className="h-10 bg-zinc-700 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 bg-zinc-700 rounded"></div>
                  <div className="h-10 bg-zinc-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Aucune mission
  if (missions.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-400 text-lg font-medium">Aucune mission trouvée</p>
        <p className="text-gray-500 text-sm mt-2">Ajustez vos filtres et réessayez</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          missionId={mission.id}
        />
      ))}
    </div>
  );
}