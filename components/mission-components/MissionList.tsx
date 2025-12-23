// app/components/MissionList.tsx
import { Mission } from "@/app/data/missions";
import MissionCard from "./MissionCard";

type Props = {
  missions: Mission[];
};

export default function MissionList({ missions }: Props) {
  if (missions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-800 rounded-full mb-4">
          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-400 text-xl font-medium">Aucune mission trouvée</p>
        <p className="text-gray-500 text-sm mt-2">Essayez de modifier vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </div>
  );
}