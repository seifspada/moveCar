import { MissionDetails } from "@/app/types/mission";
import MissionCard from "./MissionCard";
import { useRouter } from 'next/navigation';

type Props = {
  missions: MissionDetails[];
  loading?: boolean;
  mode?: 'agent' | 'adherent';
  onMissionClick?: (missionId: string) => void;
};

export default function MissionList({ missions, loading = false, mode = 'agent', onMissionClick }: Props) {
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-[18px] border border-zinc-700/80 bg-zinc-900 p-3 shadow-[0_12px_28px_rgba(0,0,0,0.24)] sm:rounded-[22px] sm:p-4"
          >
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
            <div className="absolute inset-x-0 top-0 h-1/2 -translate-x-full animate-[pulse_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
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
              <div className="grid grid-cols-3 gap-2">
                <div className="h-3 rounded-full bg-zinc-800" />
                <div className="h-3 rounded-full bg-zinc-700" />
                <div className="h-3 rounded-full bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="col-span-full py-16 text-center">
        <svg className="mx-auto mb-4 h-16 w-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium text-gray-400">Aucune mission trouvée</p>
        <p className="mt-2 text-sm text-gray-500">Ajustez vos filtres et réessayez</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-4">
      {missions.map((mission) => (
        <div key={mission.id} onClick={() => handleMissionClick(mission.id)} className="cursor-pointer">
          <MissionCard mission={mission} missionId={mission.id} />
        </div>
      ))}
    </div>
  );
}