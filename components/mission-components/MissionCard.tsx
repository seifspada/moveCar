'use client';

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

  // Error handling
  if (!mission) {
    return (
      <div className="w-full bg-red-900/20 border-2 border-red-500 rounded-lg p-4 md:p-6">
        <p className="text-red-400 text-sm md:text-base">
          Erreur : données de mission invalides
        </p>
      </div>
    );
  }

  // ✅ Get config objects
  const vehicleConfig = getVehicleConfig(mission.typeVehicule);
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
      className="w-full bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 
                 rounded-2xl shadow-2xl border border-zinc-700 
                 hover:border-orange-500 hover:shadow-orange-500/20 
                 transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      <div className="flex flex-col sm:flex-row items-stretch h-full">
        
        {/* ========== LEFT SECTION: VEHICLE ICON ========== */}
        <div className="relative w-full sm:w-24 md:w-28 lg:w-32 
                        bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 
                        flex items-center justify-center p-3 sm:p-4 md:p-5 flex-shrink-0
                        group-hover:scale-105 transition-transform duration-300">
          
          {/* White circle container */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28
                          bg-white rounded-full flex items-center justify-center 
                          shadow-lg">
            
            {/* Fuel icon - positioned at top */}
            <div className="absolute top-2 right-2 md:top-3 md:right-3">
              <div className="relative w-5 h-5 md:w-7 md:h-7 
                              bg-zinc-100 rounded-full flex items-center justify-center
                              shadow-md border border-zinc-200">
                <Image
                  src={carburantInfo.image}
                  alt={carburantInfo.label}
                  width={20}
                  height={20}
                  className="w-3 h-3 md:w-4 md:h-4 object-contain"
                  priority
                />
              </div>
            </div>

            {/* Vehicle icon - centered */}
            <Image
              src={vehicleConfig.icon}
              alt={vehicleConfig.label}
              width={64}
              height={64}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain"
              priority
            />
          </div>
        </div>

        {/* ========== CENTER & RIGHT SECTION: CONTENT ========== */}
        <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 md:p-6 min-w-0">
          
          {/* ========== ROW 1: ROUTE INFO ========== */}
          <div className="grid grid-cols-12 gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-2 sm:gap-y-3 md:gap-y-4 mb-4 md:mb-6">
            
            {/* Departure city */}
            <div className="col-span-3 flex items-center gap-1.5 sm:gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500/20 rounded-full 
                              flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-[10px] sm:text-xs leading-tight">Départ</p>
                <p className="text-white font-bold text-xs sm:text-sm md:text-base leading-tight truncate">
                  {mission.villeDepart || 'N/A'}
                </p>
              </div>
            </div>

            {/* Arrow */}
            <div className="col-span-1 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-500" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>

            {/* Arrival city */}
            <div className="col-span-3 flex items-center justify-end gap-1.5 sm:gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500/20 rounded-full 
                              flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-[10px] sm:text-xs leading-tight">Arrivée</p>
                <p className="text-white font-bold text-xs sm:text-sm md:text-base leading-tight truncate">
                  {mission.villeArrivee || 'N/A'}
                </p>
              </div>
            </div>

            {/* Distance badge */}
            <div className="col-span-2 flex items-center justify-end">
              <div className="bg-zinc-800 rounded-lg px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2.5
                              border border-zinc-700 group-hover:border-orange-500/50 
                              transition-colors duration-300">
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="text-gray-400 text-[9px] sm:text-xs leading-tight">Km</p>
                </div>
                <p className="text-white font-bold text-xs sm:text-sm md:text-base leading-tight">
                  {toNumber(mission.distanceKm)}
                </p>
              </div>
            </div>

            {/* Favorite button */}
            <div className="col-span-2 flex items-center justify-end">
              <button
                onClick={handleFavoriteClick}
                className="p-1.5 sm:p-2 hover:bg-orange-500/10 rounded-lg 
                           transition-all duration-200 hover:scale-110"
                aria-label="Ajouter aux favoris"
              >
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-all duration-200 ${
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

            {/* Amount badge */}
            <div className="col-span-12 sm:col-span-4 flex items-center justify-end sm:justify-start md:justify-end">
              <div className="relative rounded-xl overflow-hidden px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-3
                              bg-gradient-to-br from-orange-500/20 to-red-500/20 
                              border border-orange-500/50 group-hover:border-orange-500
                              transition-all duration-300">
                <div className="relative flex flex-col items-center justify-center">
                  <p className="text-gray-300 text-[9px] sm:text-xs mb-0.5">Total</p>
                  <p className="text-orange-400 font-bold text-sm sm:text-base md:text-lg">
                    {formatPrice(mission.montantTotal)}€
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========== ROW 2: DETAILS ========== */}
          <div className="grid grid-cols-12 gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-2 sm:gap-y-3">
            
            {/* Vehicle type */}
            <div className="col-span-4 sm:col-span-3">
              <div className="bg-zinc-800 rounded-lg px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3
                              border border-zinc-700 group-hover:border-orange-500/50
                              transition-colors duration-300 h-full flex flex-col justify-center">
                <p className="text-gray-400 text-[9px] sm:text-xs mb-1">Type</p>
                <p className="text-white font-semibold text-xs sm:text-sm md:text-base 
                            leading-tight whitespace-nowrap truncate">
                  {vehicleConfig.label}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="col-span-4 sm:col-span-5">
              <div className="bg-zinc-800 rounded-lg px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3
                              border border-zinc-700 group-hover:border-orange-500/50
                              transition-colors duration-300 h-full flex flex-col justify-center">
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-[9px] sm:text-xs">Date</p>
                </div>
                <p className="text-white font-semibold text-xs sm:text-sm md:text-base 
                            leading-tight whitespace-nowrap truncate">
                  {formatDateRange(mission.dateDebut, mission.dateDepartMax)}
                </p>
              </div>
            </div>

            {/* Toll fees */}
            <div className="col-span-4 sm:col-span-4">
              <div className="bg-zinc-800 rounded-lg px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3
                              border border-zinc-700 group-hover:border-orange-500/50
                              transition-colors duration-300 h-full flex flex-col justify-center">
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-400 text-[9px] sm:text-xs">Péage</p>
                </div>
                <p className="text-white font-semibold text-xs sm:text-sm md:text-base leading-tight">
                  {formatPrice(mission.fraisPeage)}€
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== HOVER EFFECT: OVERLAY ========== */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 
                        pointer-events-none" />
      )}
    </div>
  );
}