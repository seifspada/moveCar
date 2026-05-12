'use client';

// components/mission-components/MissionCard.tsx
// ✅ REDESIGN : Design externe comme Image 1 - compact et dense
// Triangle orange + layout optimisé + tous les attributs préservés

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
      <div className="bg-red-900/20 border-2 border-red-500 rounded-xl p-3 flex items-center justify-center">
        <p className="text-red-400 text-xs text-center">Erreur : données invalides</p>
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
      className="relative w-full bg-gradient-to-br from-zinc-800 via-zinc-800 to-zinc-900
                 rounded-2xl shadow-lg border border-zinc-700 
                 hover:border-orange-500 hover:shadow-orange-500/30 
                 transition-all duration-300 overflow-hidden cursor-pointer group
                 p-3 sm:p-4"
    >
      {/* ========== TRIANGLE ORANGE (haut-gauche) ========== */}
      <div className="absolute top-0 left-0 w-0 h-0 
                      border-l-[50px] border-r-[0px] border-t-[50px] border-b-[0px]
                      border-l-transparent border-t-orange-500
                      sm:border-l-[60px] sm:border-t-[60px]">
      </div>

      {/* ========== CONTENU PRINCIPAL ========== */}
      <div className="relative flex flex-col gap-2 sm:gap-3">

        {/* ========== SECTION 1: ICON + TITRE + FAVORITE + KM ========== */}
        <div className="flex items-start justify-between gap-2">
          {/* Vehicle Icon (dans le triangle) */}
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10">
            <Image
              src={vehicleConf.icon}
              alt={vehicleConf.label}
              width={36}
              height={36}
              className="w-7 h-7 sm:w-9 sm:h-9 drop-shadow-lg"
              priority
            />
          </div>

          {/* Espace pour le triangle */}
          <div className="w-14 sm:w-16"></div>

          {/* Titre: Départ to Arrivée */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
              {mission.villeDepart} to {mission.villeArrivee}
            </h3>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="p-1 hover:bg-orange-500/10 rounded flex-shrink-0"
            aria-label="Ajouter aux favoris"
          >
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
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

        {/* ========== SECTION 2: BADGES PRIX + KM (2 colonnes) ========== */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {/* Total Price Badge */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2
                          border border-orange-500/50 group-hover:border-orange-500 
                          transition-all duration-300">
            <p className="text-gray-300 text-[8px] sm:text-xs mb-0.5">Total</p>
            <p className="text-orange-400 font-bold text-xs sm:text-sm">
              {formatPrice(mission.montantTotal)}€
            </p>
          </div>

          {/* KM Badge */}
          <div className="bg-zinc-900 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 
                          border border-zinc-600 group-hover:border-orange-500/50
                          transition-colors duration-300">
            <p className="text-gray-400 text-[8px] sm:text-xs mb-0.5">Km</p>
            <p className="text-white font-bold text-xs sm:text-sm">
              {toNumber(mission.distanceKm)}
            </p>
          </div>
        </div>

        {/* ========== SECTION 3: TYPE + CARBURANT (2 colonnes) ========== */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {/* Vehicle Type */}
          <div className="bg-zinc-900 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2
                          border border-zinc-600 group-hover:border-orange-500/50
                          transition-colors duration-300">
            <div className="flex items-center gap-1 mb-0.5">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-gray-400 text-[8px] sm:text-xs">Type</p>
            </div>
            <p className="text-white font-semibold text-xs sm:text-sm">
              {vehicleConf.label}
            </p>
          </div>

          {/* Fuel Type */}
          <div className="bg-zinc-900 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2
                          border border-zinc-600 group-hover:border-orange-500/50
                          transition-colors duration-300">
            <div className="flex items-center gap-1 mb-0.5">
              <Image
                src={carburantInfo.image}
                alt={carburantInfo.label}
                width={12}
                height={12}
                className="w-3 h-3 object-contain"
                priority
              />
              <p className="text-gray-400 text-[8px] sm:text-xs">Carburant</p>
            </div>
            <p className={`font-semibold text-xs sm:text-sm ${carburantInfo.color}`}>
              {carburantInfo.label}
            </p>
          </div>
        </div>

        {/* ========== SECTION 4: DATE + PÉAGE (2 colonnes) ========== */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {/* Date */}
          <div className="bg-zinc-900 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2
                          border border-zinc-600 group-hover:border-orange-500/50
                          transition-colors duration-300">
            <div className="flex items-center gap-1 mb-0.5">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-[8px] sm:text-xs">Date</p>
            </div>
            <p className="text-white font-semibold text-xs sm:text-sm leading-tight">
              {formatDateRange(mission.dateDebut, mission.dateDepartMax)}
            </p>
          </div>

          {/* Toll Fees */}
          <div className="bg-zinc-900 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2
                          border border-zinc-600 group-hover:border-orange-500/50
                          transition-colors duration-300">
            <div className="flex items-center gap-1 mb-0.5">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-400 text-[8px] sm:text-xs">Péage</p>
            </div>
            <p className="text-white font-semibold text-xs sm:text-sm">
              {formatPrice(mission.fraisPeage)}€
            </p>
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