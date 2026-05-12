'use client';

// components/mission-components/MissionCard.tsx
// ✅ REDESIGN : Petit carreau compact style "card grid"
// Avec triangle orange en haut-gauche + tous les attributs en place

import { MissionDetails } from "@/app/types/mission";
import { getCarburantConfig, getVehicleConfig } from "@/app/config/mission-icons.config";
import { formatPrice, toNumber, formatDateRange } from "@/app/utils/format";
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
  const [isHovered, setIsHovered] = useState(false);

  if (!mission) {
    return (
      <div className="bg-red-900/20 border-2 border-red-500 rounded-xl p-4 min-h-[360px] flex items-center justify-center">
        <p className="text-red-400 text-sm text-center">Erreur : données invalides</p>
      </div>
    );
  }

  // Debug logs
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚗 [MissionCard] id=${missionId}`);
    console.log(`   typeVehicule  = "${mission.typeVehicule}"`);
    console.log(`   typeCarburant = "${mission.typeCarburant}"`);
  }

  const vehicleConf = getVehicleConfig(mission.typeVehicule);
  const carburantInfo = getCarburantConfig(mission.typeCarburant);

  const handleCardClick = () => {
    router.push(`/adherent/mission-reservation/${missionId || 'default'}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full min-h-[360px] bg-gradient-to-br from-zinc-800 via-zinc-800 to-zinc-900
                 rounded-2xl shadow-lg border border-zinc-700 
                 hover:border-orange-500 hover:shadow-orange-500/30 
                 transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* ========== TRIANGLE ORANGE (haut-gauche) ========== */}
      <div className="absolute top-0 left-0 w-0 h-0 
                      border-l-[60px] border-r-[0px] border-t-[60px] border-b-[0px]
                      border-l-transparent border-t-orange-500
                      sm:border-l-[80px] sm:border-t-[80px]">
      </div>

      {/* ========== CONTENU PRINCIPAL ========== */}
      <div className="relative p-4 sm:p-5 md:p-6 h-full flex flex-col justify-between">

        {/* ========== HAUT: ICON + FAVORITE + KM ========== */}
        <div className="flex items-start justify-between mb-4 sm:mb-5 md:mb-6">
          {/* Vehicle Icon (dans le triangle) */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
            <Image
              src={vehicleConf.icon}
              alt={vehicleConf.label}
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-lg"
              priority
            />
          </div>

          {/* Espace pour le triangle */}
          <div className="w-16 sm:w-20"></div>

          {/* Kilometer badge (haut-droit) */}
          <div className="text-right">
            <p className="text-gray-400 text-[10px] sm:text-xs mb-1">Km</p>
            <div className="bg-zinc-900 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 
                            border border-zinc-600 group-hover:border-orange-500/50
                            transition-colors duration-300 inline-block">
              <p className="text-white font-bold text-sm sm:text-base">
                {toNumber(mission.distanceKm)}
              </p>
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="ml-2 p-1.5 hover:bg-orange-500/10 rounded-lg 
                       transition-all duration-200 hover:scale-110 flex-shrink-0"
            aria-label="Ajouter aux favoris"
          >
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${
                isFavorite
                  ? 'fill-orange-500 text-orange-500'
                  : 'fill-none text-gray-400 hover:text-orange-400'
              }`}
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        </div>

        {/* ========== MILIEU: ROUTE (Départ to Arrivée) ========== */}
        <div className="mb-4 sm:mb-5">
          <h3 className="text-white font-bold text-base sm:text-lg md:text-xl leading-tight mb-1">
            {mission.villeDepart} to {mission.villeArrivee}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm">
            {mission.villeDepart} → {mission.villeArrivee}
          </p>
        </div>

        {/* ========== BADGES: PRIX ET KM (milieu) ========== */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {/* Total Price Badge */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3
                          border border-orange-500/50 group-hover:border-orange-500 
                          transition-all duration-300 text-center">
            <p className="text-gray-300 text-[9px] sm:text-xs mb-1">Total</p>
            <p className="text-orange-400 font-bold text-sm sm:text-base md:text-lg">
              {formatPrice(mission.montantTotal)}€
            </p>
          </div>

          {/* KM Badge */}
          <div className="bg-zinc-900 rounded-lg px-3 py-2 sm:px-4 sm:py-3 
                          border border-zinc-600 group-hover:border-orange-500/50
                          transition-colors duration-300 text-center">
            <p className="text-gray-400 text-[9px] sm:text-xs mb-1">Km</p>
            <p className="text-white font-bold text-sm sm:text-base md:text-lg">
              {toNumber(mission.distanceKm)}
            </p>
          </div>
        </div>

        {/* ========== BAS: ATTRIBUTS (Type, Carburant, Date, Péage) ========== */}
        <div className="space-y-2 sm:space-y-2.5">
          {/* Row 1: Type + Carburant */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {/* Vehicle Type */}
            <div className="bg-zinc-900 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2
                            border border-zinc-600 group-hover:border-orange-500/50
                            transition-colors duration-300">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-gray-400 text-[9px] sm:text-xs font-medium">Type</p>
              </div>
              <p className="text-white font-semibold text-xs sm:text-sm leading-tight">
                {vehicleConf.label}
              </p>
            </div>

            {/* Fuel Type */}
            <div className="bg-zinc-900 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2
                            border border-zinc-600 group-hover:border-orange-500/50
                            transition-colors duration-300">
              <div className="flex items-center gap-1.5 mb-1">
                <Image
                  src={carburantInfo.image}
                  alt={carburantInfo.label}
                  width={14}
                  height={14}
                  className="w-3 h-3 sm:w-4 sm:h-4 object-contain"
                  priority
                />
                <p className="text-gray-400 text-[9px] sm:text-xs font-medium">Carburant</p>
              </div>
              <p className={`font-semibold text-xs sm:text-sm leading-tight ${carburantInfo.color}`}>
                {carburantInfo.label}
              </p>
            </div>
          </div>

          {/* Row 2: Date + Péage */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {/* Date */}
            <div className="bg-zinc-900 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2
                            border border-zinc-600 group-hover:border-orange-500/50
                            transition-colors duration-300">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 text-[9px] sm:text-xs font-medium">Date</p>
              </div>
              <p className="text-white font-semibold text-xs sm:text-sm leading-tight">
                {formatDateRange(mission.dateDebut, mission.dateDepartMax)}
              </p>
            </div>

            {/* Toll Fees */}
            <div className="bg-zinc-900 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2
                            border border-zinc-600 group-hover:border-orange-500/50
                            transition-colors duration-300">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-400 text-[9px] sm:text-xs font-medium">Péage</p>
              </div>
              <p className="text-white font-semibold text-xs sm:text-sm leading-tight">
                {formatPrice(mission.fraisPeage)}€
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== HOVER OVERLAY ========== */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent 
                        pointer-events-none rounded-2xl" />
      )}
    </div>
  );
}