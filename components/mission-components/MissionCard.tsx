'use client';

import { MissionDetails } from "@/app/types/mission";
import { getCarburantConfig, getVehicleConfig } from "@/app/config/mission-icons.config";
import { formatPrice, toNumber, formatDateRange } from "@/app/utils/format";
import { ArrowRight, CalendarDays, Fuel, Route, Star, Ticket, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MissionCardProps {
  mission: MissionDetails;
  missionId?: string;
}

export default function MissionCard({ mission, missionId }: MissionCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  if (!mission) {
    return (
      <div className="flex items-center justify-center rounded-xl border-2 border-red-500 bg-red-900/20 p-3">
        <p className="text-center text-xs text-red-400">Erreur : donn&eacute;es invalides</p>
      </div>
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[MissionCard] id=${missionId}`);
    console.log(`   typeVehicule  = "${mission.typeVehicule}"`);
    console.log(`   typeCarburant = "${mission.typeCarburant}"`);
  }

  const vehicleConf = getVehicleConfig(mission.typeVehicule);
  const carburantInfo = getCarburantConfig(mission.typeCarburant);
  const dateRange = formatDateRange(mission.dateDebut, mission.dateDepartMax);
  const [dateStart, dateEnd] = dateRange.split(" - ");

  const handleCardClick = () => {
    router.push(`/adherent/mission-reservation/${missionId || "default"}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite((current) => !current);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative min-h-[360px] w-full cursor-pointer overflow-hidden rounded-[28px] border border-orange-500/35
                 bg-[radial-gradient(circle_at_28%_0%,rgba(249,115,22,0.12),transparent_34%),linear-gradient(145deg,#18181b_0%,#111113_52%,#09090b_100%)]
                 p-5 pt-6 text-white shadow-[0_18px_45px_rgba(0,0,0,0.32),0_0_0_1px_rgba(255,255,255,0.04)]
                 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/80
                 hover:shadow-[0_22px_60px_rgba(0,0,0,0.36),0_0_28px_rgba(249,115,22,0.26)]
                 sm:min-h-[390px] sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/5" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-orange-200/70 to-transparent" />
      <div
        className="absolute left-0 top-0 h-32 w-36 bg-gradient-to-br from-orange-400 via-orange-600 to-red-600 shadow-[10px_10px_24px_rgba(0,0,0,0.34)] sm:h-40 sm:w-44"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />

      <div className="absolute left-4 top-5 z-10 grid h-16 w-16 place-items-center rounded-full bg-zinc-50 shadow-[0_10px_22px_rgba(0,0,0,0.38)] ring-1 ring-black/10 sm:left-6 sm:top-7 sm:h-20 sm:w-20">
        <Image
          src={vehicleConf.icon}
          alt={vehicleConf.label}
          width={58}
          height={58}
          className="h-11 w-11 object-contain sm:h-14 sm:w-14"
          priority
        />
      </div>

      <button
        onClick={handleFavoriteClick}
        className="absolute right-4 top-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-zinc-950/40 text-zinc-400 backdrop-blur
                   transition-all duration-200 hover:border-orange-300/60 hover:bg-orange-500/10 hover:text-orange-300 sm:right-6 sm:top-7"
        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Star
          className={`h-7 w-7 transition-all duration-200 ${
            isFavorite ? "fill-orange-400 text-orange-400" : "fill-transparent"
          }`}
          strokeWidth={1.8}
        />
      </button>

      <div className="relative z-10 flex h-full flex-col">
        <div className="min-h-[96px] pl-20 pr-12 sm:min-h-[120px] sm:pl-24">
          <div className="flex flex-col items-center gap-1 pt-10 text-center sm:pt-11">
            <h3 className="max-w-full text-balance text-[1.42rem] font-extrabold leading-tight tracking-normal text-zinc-100 drop-shadow sm:text-2xl">
              <span className="block truncate">{mission.villeDepart}</span>
              <span className="mt-1 inline-flex max-w-full items-center justify-center gap-2 text-zinc-200">
                <ArrowRight className="h-5 w-5 flex-none text-orange-400" strokeWidth={2.4} />
                <span className="truncate">{mission.villeArrivee}</span>
              </span>
            </h3>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-orange-400/45 bg-orange-500/10 px-3 py-3 text-center shadow-inner shadow-orange-950/30 transition-colors group-hover:border-orange-300/80 sm:px-4">
            <p className="text-sm font-medium text-zinc-400">Total</p>
            <p className="mt-1 text-xl font-extrabold leading-none text-orange-400 sm:text-2xl">
              {formatPrice(mission.montantTotal)}&euro;
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-700/80 bg-zinc-950/45 px-3 py-3 text-center shadow-inner shadow-black/30 transition-colors group-hover:border-zinc-500 sm:px-4">
            <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-zinc-400">
              <Route className="h-4 w-4" />
              Km
            </p>
            <p className="mt-1 text-xl font-extrabold leading-none text-zinc-100 sm:text-2xl">
              {toNumber(mission.distanceKm)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Truck className="h-7 w-7 flex-none text-zinc-500" strokeWidth={1.8} />
              <p className="truncate text-xl font-extrabold text-zinc-100 sm:text-2xl">
                {vehicleConf.label}
              </p>
            </div>

            <div className="flex min-w-0 items-center justify-end gap-3">
              <Image
                src={carburantInfo.image}
                alt={carburantInfo.label}
                width={28}
                height={28}
                className="h-7 w-7 flex-none object-contain"
                priority
              />
              <p className={`truncate text-xl font-extrabold sm:text-2xl ${carburantInfo.color}`}>
                {carburantInfo.label}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-end gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <CalendarDays className="mt-1 h-7 w-7 flex-none text-zinc-500" strokeWidth={1.8} />
              <p className="text-xl font-extrabold leading-tight text-zinc-100 sm:text-2xl">
                <span className="block">{dateStart}</span>
                {dateEnd && <span className="block">{dateEnd}</span>}
              </p>
            </div>

            <div className="text-right">
              <p className="flex items-center justify-end gap-2 text-lg font-medium text-zinc-500">
                <Ticket className="h-6 w-6" strokeWidth={1.8} />
                P&eacute;age
              </p>
              <p className="mt-1 text-xl font-extrabold text-zinc-100 sm:text-2xl">
                {formatPrice(mission.fraisPeage)}&euro;
              </p>
            </div>
          </div>
        </div>
      </div>

      <Fuel className="pointer-events-none absolute bottom-4 right-4 h-5 w-5 text-orange-400/25" />
    </div>
  );
}
