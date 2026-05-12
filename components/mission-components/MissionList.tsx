import { MissionDetails } from "@/app/types/mission";
import MissionCard from "./MissionCard";

type Props = {
  missions: MissionDetails[];
  loading?: boolean;
};

export default function MissionList({ missions, loading = false }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 p-5 animate-pulse sm:min-h-[390px] sm:p-6"
          >
            <div
              className="absolute left-0 top-0 h-32 w-36 bg-zinc-700 sm:h-40 sm:w-44"
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            />
            <div className="relative z-10">
              <div className="flex justify-between">
                <div className="h-16 w-16 rounded-full bg-zinc-600 sm:h-20 sm:w-20" />
                <div className="h-11 w-11 rounded-full bg-zinc-700" />
              </div>
              <div className="mx-auto mt-4 space-y-2">
                <div className="mx-auto h-7 w-2/3 rounded bg-zinc-700" />
                <div className="mx-auto h-7 w-1/2 rounded bg-zinc-700" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="h-20 rounded-2xl bg-zinc-700" />
                <div className="h-20 rounded-2xl bg-zinc-700" />
              </div>
              <div className="mt-6 space-y-4">
                <div className="h-8 rounded bg-zinc-700" />
                <div className="h-16 rounded bg-zinc-700" />
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-medium text-gray-400">Aucune mission trouv&eacute;e</p>
        <p className="mt-2 text-sm text-gray-500">Ajustez vos filtres et r&eacute;essayez</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
