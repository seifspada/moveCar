// app/components/mission/MissionList.tsx
import { MissionDetails } from "@/app/types/mission";
import MissionCard from "./MissionCard";

type Props = {
  missions: MissionDetails[];
  loading?: boolean;
};

export default function MissionList({ missions, loading = false }: Props) {
  // Ton code actuel reste identique
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-zinc-900 rounded-lg p-6 animate-pulse border-2 border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-zinc-800 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-xl font-medium">Aucune mission trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {missions.map((mission) => (
        <MissionCard 
          key={mission.id}  // ✅ utilise l'ID réel
          mission={mission} 
          missionId={mission.id} 
        />
      ))}
    </div>
  );
}
