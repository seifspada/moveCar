'use client';
import { MissionDetails } from "@/app/types/mission";
import { getCarburantConfig, getVehicleConfig } from "@/app/config/mission-icons.config";
import { formatPrice, toNumber, formatDateRange } from "@/app/utils/format";
import { ArrowRight, CalendarDays, Route, Star, Ticket, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from '@apollo/client/react';
import { TOGGLE_FAVORI } from '@/lib/graphql/queries/mission-card';

interface MissionCardProps {
  mission: MissionDetails;
  missionId?: string;
}

export default function MissionCard({ mission, missionId }: MissionCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(mission.isFavori ?? false);

  // ✅ Pas de refetchQueries → pas de skeleton/loading sur la liste
  const [toggleFavori] = useMutation<{ toggleFavori: boolean }>(TOGGLE_FAVORI, {
    onError: (error) => {
      console.error('❌ Erreur toggle favori:', error);
      // Rollback optimistic update si erreur backend
      setIsFavorite((current) => !current);
    },
    // ✅ Mise à jour du cache Apollo sans re-fetch
    update(cache) {
      cache.modify({
        id: cache.identify({ __typename: 'Mission', id: mission.id }),
        fields: {
          isFavori(existing: boolean) {
            return !existing;
          },
        },
      });
    },
  });

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

  // ✅ Optimistic update immédiat + appel backend silencieux
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite((current) => !current);
    await toggleFavori({ variables: { missionId: mission.id } });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative min-h-[282px] w-full cursor-pointer overflow-hidden rounded-[22px] border border-orange-500/35
                 bg-[radial-gradient(circle_at_28%_0%,rgba(249,115,22,0.12),transparent_34%),linear-gradient(145deg,#18181b_0%,#111113_52%,#09090b_100%)]
                 p-2.5 pb-2 pt-3 text-white shadow-[0_18px_45px_rgba(0,0,0,0.32),0_0_0_1px_rgba(255,255,255,0.04)]
                 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/80
                 hover:shadow-[0_22px_60px_rgba(0,0,0,0.36),0_0_28px_rgba(249,115,22,0.26)]
                 sm:min-h-[340px] sm:rounded-[28px] sm:p-5 sm:pb-4 xl:min-h-[370px] xl:p-6 xl:pb-5"
    >
      {/* Décorations */}
      <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/5 sm:rounded-[28px]" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-orange-200/70 to-transparent" />

      {/* Coin coloré */}
      <div
        className="absolute left-0 top-0 h-20 w-24 bg-gradient-to-br from-orange-400 via-orange-600 to-red-600 shadow-[10px_10px_24px_rgba(0,0,0,0.34)] sm:h-32 sm:w-36 xl:h-40 xl:w-44"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />

      {/* Icône véhicule */}
      <div className="absolute left-2.5 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-zinc-50 shadow-[0_10px_22px_rgba(0,0,0,0.38)] ring-1 ring-black/10 sm:left-5 sm:top-6 sm:h-16 sm:w-16 xl:left-6 xl:top-7 xl:h-20 xl:w-20">
        <Image
          src={vehicleConf.icon}
          alt={vehicleConf.label}
          width={58}
          height={58}
          className="h-7 w-7 object-contain sm:h-11 sm:w-11 xl:h-14 xl:w-14"
          priority
        />
      </div>

      {/* Bouton favori */}
      <button
        onClick={handleFavoriteClick}
        className="absolute right-2.5 top-3 z-20 grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-zinc-950/40 text-zinc-400 backdrop-blur
                   transition-all duration-200 hover:border-orange-300/60 hover:bg-orange-500/10 hover:text-orange-300 sm:right-5 sm:top-6 sm:h-10 sm:w-10 xl:right-6 xl:top-7 xl:h-11 xl:w-11"
        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Star
          className={`h-[18px] w-[18px] transition-all duration-200 sm:h-6 sm:w-6 xl:h-7 xl:w-7 ${
            isFavorite ? "fill-orange-400 text-orange-400" : "fill-transparent"
          }`}
          strokeWidth={1.8}
        />
      </button>

      {/* Contenu principal */}
      <div className="relative z-10 flex h-full flex-col">

        {/* Villes départ / arrivée */}
        <div className="min-h-[84px] pl-12 pr-8 sm:min-h-[116px] sm:pl-20 sm:pr-12 xl:min-h-[132px] xl:pl-24">
          <div className="flex flex-col items-center gap-0.5 pt-5 text-center sm:gap-1 sm:pt-9 xl:pt-10">
            <h3 className="max-w-full text-balance font-extrabold leading-tight tracking-normal text-zinc-100 drop-shadow
                           text-[0.65rem] sm:text-[0.9rem] xl:text-[1.2rem]">
              <span className="block whitespace-normal break-words">{mission.villeDepart}</span>
              <span className="mt-0.5 flex max-w-full items-start justify-center gap-1 text-zinc-200 sm:mt-1 sm:gap-2">
                <ArrowRight className="mt-0.5 h-3 w-3 flex-none text-orange-400 sm:h-4 sm:w-4 xl:h-5 xl:w-5" strokeWidth={2.4} />
                <span className="min-w-0 whitespace-normal break-words text-left">{mission.villeArrivee}</span>
              </span>
            </h3>
          </div>
        </div>

        {/* Montant + Distance */}
        <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:mt-4 sm:gap-3">
          <div className="rounded-xl border border-orange-400/45 bg-orange-500/10 px-1.5 py-1.5 text-center shadow-inner shadow-orange-950/30 transition-colors group-hover:border-orange-300/80 sm:rounded-2xl sm:px-3 sm:py-3 xl:px-4">
            <p className="text-[9px] font-medium text-zinc-400 sm:text-sm">Total</p>
            <p className="mt-0.5 text-[0.78rem] font-extrabold leading-none text-orange-400 sm:mt-1 sm:text-xl xl:text-2xl">
              {formatPrice(mission.montantTotal)}&euro;
            </p>
          </div>
          <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/45 px-1.5 py-1.5 text-center shadow-inner shadow-black/30 transition-colors group-hover:border-zinc-500 sm:rounded-2xl sm:px-3 sm:py-3 xl:px-4">
            <p className="flex items-center justify-center gap-1 text-[9px] font-medium text-zinc-400 sm:gap-1.5 sm:text-sm">
              <Route className="h-3 w-3 sm:h-4 sm:w-4" />
              Km
            </p>
            <p className="mt-0.5 text-[0.78rem] font-extrabold leading-none text-zinc-100 sm:mt-1 sm:text-xl xl:text-2xl">
              {toNumber(mission.distanceKm)}
            </p>
          </div>
        </div>

        {/* Véhicule + Carburant + Date + Péage */}
        <div className="mt-3 grid gap-2.5 sm:mt-5 sm:gap-4 xl:mt-6">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-4">
            <div className="flex min-w-0 items-center gap-1 sm:gap-3">
              <Truck className="h-4 w-4 flex-none text-zinc-500 sm:h-6 sm:w-6 xl:h-7 xl:w-7" strokeWidth={1.8} />
              <p className="min-w-0 whitespace-normal break-words text-[0.68rem] font-extrabold leading-tight text-zinc-100 sm:text-base xl:text-xl">
                {vehicleConf.label}
              </p>
            </div>
            <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-3">
              <Image
                src={carburantInfo.image}
                alt={carburantInfo.label}
                width={28}
                height={28}
                className="h-4 w-4 flex-none object-contain sm:h-6 sm:w-6 xl:h-7 xl:w-7"
                priority
              />
              <p className={`min-w-0 whitespace-normal break-words text-right text-[0.68rem] font-extrabold leading-tight sm:text-base xl:text-xl ${carburantInfo.color}`}>
                {carburantInfo.label}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 sm:gap-4">
            <div className="flex min-w-0 items-start gap-1 sm:gap-3">
              <CalendarDays className="mt-0.5 h-4 w-4 flex-none text-zinc-500 sm:mt-1 sm:h-5 sm:w-5 xl:h-6 xl:w-6" strokeWidth={1.8} />
              <p className="text-[0.68rem] font-extrabold leading-tight text-zinc-100 sm:text-base xl:text-lg">
                <span className="block">{dateStart}</span>
                {dateEnd && <span className="block">{dateEnd}</span>}
              </p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-0.5 text-[0.62rem] font-medium text-zinc-500 sm:gap-1.5 sm:text-sm xl:text-base">
                <Ticket className="h-3.5 w-3.5 sm:h-4 sm:w-4 xl:h-5 xl:w-5" strokeWidth={1.8} />
                P&eacute;age
              </p>
              <p className="mt-0.5 text-[0.74rem] font-extrabold leading-none text-zinc-100 sm:mt-1 sm:text-base xl:text-xl">
                {formatPrice(mission.fraisPeage)}&euro;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}