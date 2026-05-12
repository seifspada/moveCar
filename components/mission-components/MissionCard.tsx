'use client';

// components/mission-components/MissionCard.tsx
// ✅ REDESIGN : Petit carreau compact (grid layout)
// Mobile: 2 colonnes | Tablet: 3 colonnes | Desktop: 4-6 colonnes

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
      <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-4 aspect-square flex items-center justify-center">
        <p className="text-red-400 text-xs text-center">Erreur : données invalides</p>
      </div>
    );
  }

  // ✅ Debug logs
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
      className="relative w-full aspect-square bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950
                 rounded-xl shadow-lg border border-zinc-700 
                 hover:border-orange-500 hover:shadow-orange-500/30 
                 transition-all duration-300 overflow-hidden cursor-pointer group
                 p-3 sm:p-4 flex flex-col justify-between"
    >
      {/* ========== TOP SECTION: ICON + FAVORITE ========== */}
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        {/* Vehicle Icon */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16
                        bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 
                        rounded-lg flex items-center justify-center flex-shrink-0
                        group-hover:scale-105 transition-transform duration-300 shadow-md">
          
          {/* Fuel icon - top right corner */}
          <div className="absolute -top-2 -right-2 z-10">
            <div className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center
                            shadow-md border-2 border-zinc-900 ${carburantInfo.bgColor}`}>
              <Image
                src={carburantInfo.image}
                alt={carburantInfo.label}
                width={16}
                height={16}
                className="w-3 h-3 object-contain"
                priority
              />
            </div>
          </div>

          {/* Vehicle icon - centered */}
          <Image
            src={vehicleConf.icon}
            alt={vehicleConf.label}
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            priority
          />
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="p-1.5 hover:bg-orange-500/10 rounded-lg 
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

      {/* ========== MIDDLE SECTION: ROUTE INFO ========== */}
      <div className="flex flex-col gap-2 mb-3 sm:mb-4 flex-1 justify-center">
        {/* Route compacte */}
        <div className="flex items-center gap-1.5 min-h-[2rem]">
          {/* Départ */}
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-[9px] sm:text-[10px] leading-none mb-0.5">Départ</p>
            <p className="text-white font-bold text-xs sm:text-sm leading-tight truncate">
              {mission.villeDepart || 'N/A'}
            </p>
          </div>

          {/* Arrow */}
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>

          {/* Arrivée */}
          <div className="flex-1 min-w-0 text-right">
            <p className="text-gray-500 text-[9px] sm:text-[10px] leading-none mb-0.5">Arrivée</p>
            <p className="text-white font-bold text-xs sm:text-sm leading-tight truncate">
              {mission.villeArrivee || 'N/A'}
            </p>
          </div>
        </div>

        {/* Distance compact */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-gray-400">{toNumber(mission.distanceKm)} km</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400 text-[9px] sm:text-xs">
            {formatDateRange(mission.dateDebut, mission.dateDepartMax)}
          </span>
        </div>
      </div>

      {/* ========== BOTTOM SECTION: SPECS + PRICE ========== */}
      <div className="space-y-2 sm:space-y-2.5">
        {/* Specs row */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs">
          {/* Vehicle Type */}
          <div className="bg-zinc-800 rounded-md px-1.5 py-0.5 sm:px-2 sm:py-1 border border-zinc-700 
                          group-hover:border-orange-500/50 transition-colors duration-300 flex-shrink-0">
            <p className="text-white font-semibold whitespace-nowrap">
              {vehicleConf.label}
            </p>
          </div>

          {/* Fuel Type */}
          <div className="bg-zinc-800 rounded-md px-1.5 py-0.5 sm:px-2 sm:py-1 border border-zinc-700 
                          group-hover:border-orange-500/50 transition-colors duration-300 flex-shrink-0">
            <p className={`font-semibold whitespace-nowrap ${carburantInfo.color}`}>
              {carburantInfo.label}
            </p>
          </div>

          {/* Peage */}
          <div className="bg-zinc-800 rounded-md px-1.5 py-0.5 sm:px-2 sm:py-1 border border-zinc-700 
                          group-hover:border-orange-500/50 transition-colors duration-300 ml-auto flex-shrink-0">
            <p className="text-gray-300 font-semibold whitespace-nowrap">
              Péage: {formatPrice(mission.fraisPeage)}€
            </p>
          </div>
        </div>

        {/* Price highlight */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5
                        border border-orange-500/50 group-hover:border-orange-500 
                        transition-all duration-300">
          <div className="flex items-baseline justify-between">
            <span className="text-gray-300 text-[9px] sm:text-xs">Total</span>
            <p className="text-orange-400 font-bold text-sm sm:text-base">
              {formatPrice(mission.montantTotal)}€
            </p>
          </div>
        </div>
      </div>

      {/* ========== HOVER OVERLAY ========== */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent 
                        pointer-events-none rounded-xl" />
      )}
    </div>
  );
}