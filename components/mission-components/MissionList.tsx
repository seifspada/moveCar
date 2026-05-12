import { MissionDetails } from "@/app/types/mission";
import MissionCard from "./MissionCard";

type Props = {
  missions: MissionDetails[];
  loading?: boolean;
};

export default function MissionList({ missions, loading = false }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="relative min-h-[284px] overflow-hidden rounded-[22px] border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 p-3 animate-pulse sm:min-h-[340px] sm:rounded-[28px] sm:p-5 xl:min-h-[370px] xl:p-6"
          >
            <div
              className="absolute left-0 top-0 h-24 w-28 bg-zinc-700 sm:h-32 sm:w-36 xl:h-40 xl:w-44"
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            />
            <div className="relative z-10">
              <div className="flex justify-between">
                <div className="h-12 w-12 rounded-full bg-zinc-600 sm:h-16 sm:w-16 xl:h-20 xl:w-20" />
                <div className="h-8 w-8 rounded-full bg-zinc-700 sm:h-10 sm:w-10 xl:h-11 xl:w-11" />
              </div>
              <div className="mx-auto mt-3 space-y-2 sm:mt-4">
                <div className="mx-auto h-5 w-2/3 rounded bg-zinc-700 sm:h-7" />
                <div className="mx-auto h-5 w-1/2 rounded bg-zinc-700 sm:h-7" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3">
                <div className="h-14 rounded-xl bg-zinc-700 sm:h-20 sm:rounded-2xl" />
                <div className="h-14 rounded-xl bg-zinc-700 sm:h-20 sm:rounded-2xl" />
              </div>
              <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                <div className="h-6 rounded bg-zinc-700 sm:h-8" />
                <div className="h-12 rounded bg-zinc-700 sm:h-16" />
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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
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
