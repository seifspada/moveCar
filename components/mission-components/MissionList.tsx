// app/components/mission/MissionList.tsx
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="aspect-square bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl 
                       border border-zinc-800 p-3 sm:p-4 animate-pulse"
          >
            <div className="flex flex-col justify-between h-full">
              {/* Top skeleton */}
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-800 rounded-lg"></div>
                <div className="w-5 h-5 bg-zinc-800 rounded"></div>
              </div>
              {/* Middle skeleton */}
              <div className="space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-2 bg-zinc-800 rounded w-1/2"></div>
              </div>
              {/* Bottom skeleton */}
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className="h-5 bg-zinc-800 rounded flex-1"></div>
                  <div className="h-5 bg-zinc-800 rounded flex-1"></div>
                </div>
                <div className="h-8 bg-gradient-to-r from-zinc-800 to-zinc-800 rounded-lg"></div>
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
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