// app/components/mission/MissionCard.tsx
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

  if (!mission) {
    return (
      <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
        <p className="text-red-400">Erreur : données de mission invalides</p>
      </div>
    );
  }

  // ✅ Récupérer les configs
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
      className="bg-zinc-900 rounded-full md:rounded-full lg:rounded-full shadow-lg border-2 border-zinc-800 hover:border-orange-500 transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      <div className="flex flex-row items-stretch h-full">
        {/* Section gauche : Icône du véhicule + Icône carburant */}
        <div className="relative w-16 sm:w-20 md:w-22 lg:w-34 
                bg-gradient-to-br from-orange-500 to-orange-600 
                flex items-center justify-center p-2 sm:p-2.5 md:p-3 lg:p-4.5 flex-shrink-0">

          {/* Cercle blanc */}
          <div className="relative w-8 h-8 sm:w-15 sm:h-15 md:w-19 md:h-19 lg:w-24 lg:h-24 
                  bg-white rounded-full flex items-center justify-center 
                  p-1.5 sm:p-2.5 md:p-3.5 lg:p-4.5 shadow-lg">

            {/* ✅ Icône carburant (Image PNG) */}
            <div className="absolute top-1 left-[45%] -translate-x-0 md:top-1 md:left-[40%] md:translate-x-0">
              <Image
                src={carburantInfo.image}
                alt={carburantInfo.label}
                width={20}
                height={20}
                className="w-3 h-3 md:w-5 md:h-5 object-contain"
              />
            </div>

            {/* ✅ Icône véhicule (Image PNG) */}
<Image
  src={vehicleConfig.icon}
  alt={vehicleConfig.label}
  width={64}
  height={64}
  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain"
  style={{ width: 'auto', height: 'auto' }} // ✅ AJOUTER cette ligne
  unoptimized
/>


          </div>
        </div>

        {/* Section centrale et droite : Informations */}
        <div className="flex-1 flex flex-col justify-between p-1.5 sm:p-3 md:p-4 lg:p-6 min-w-0">
          <div className="grid grid-cols-[1fr_auto_1fr_auto_auto_auto] gap-x-1 sm:gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-1.5 sm:gap-y-3 md:gap-y-4 lg:gap-y-6">
            
            {/* ========== LIGNE 1 ========== */}
            
            {/* Ville de départ */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 md:gap-2 flex-shrink-0 min-w-[60px] sm:min-w-[80px]">
              <div className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-[6px] sm:text-[8px] md:text-[9px] lg:text-xs leading-tight">Départ</p>
                <p className="text-white font-bold text-[8px] sm:text-[10px] md:text-xs lg:text-base leading-tight truncate">
                  {mission.villeDepart || 'N/A'}
                </p>
              </div>
            </div>

            {/* Flèche horizontale */}
            <div className="flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 sm:w-5 sm:h-5 md:w-7 md:h-7 lg:w-10 lg:h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>

            {/* Ville d'arrivée */}
            <div className="flex items-center justify-end flex-shrink-0 min-w-[60px] sm:min-w-[80px] gap-0.5 sm:gap-1.5 md:gap-2">
              <div className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-[6px] sm:text-[8px] md:text-[9px] lg:text-xs leading-tight">Arrivée</p>
                <p className="text-white font-bold text-[8px] sm:text-[10px] md:text-xs lg:text-base leading-tight truncate">
                  {mission.villeArrivee || 'N/A'}
                </p>
              </div>
            </div>

            {/* Km */}
            <div className="flex items-center flex-shrink-0">
              <div className="bg-zinc-800 rounded-md px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2 md:py-1">
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1 mb-0.5 md:mb-1">
                  <svg className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-gray-400" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="text-gray-400 text-[7px] sm:text-[8px] md:text-xs leading-tight">Km</p>
                </div>
                <p className="text-white font-semibold text-[8px] sm:text-[9px] md:text-sm leading-tight">
                  {toNumber(mission.distanceKm)}
                </p>
              </div>
            </div>

            {/* Étoile favorite */}
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={handleFavoriteClick}
                className="transition-all duration-200 hover:scale-110"
                aria-label="Ajouter aux favoris"
              >
                <svg
                  className={`w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 transition-colors duration-200 ${
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

            {/* Montant */}
            <div className="flex items-center flex-shrink-0">
              <div className="relative rounded-md sm:rounded-lg overflow-hidden px-1.5 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3">
                <Image
                  src="/images/bg-montant.png"
                  alt="Background"
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 150px"
                  className="object-cover opacity-20"
                  priority
                />
                <div className="relative flex flex-col items-center justify-center">
                  <p className="text-[6px] sm:text-[8px] md:text-[9px] text-gray-300 mb-0.5">Total</p>
                  <p className="text-[9px] sm:text-sm md:text-base lg:text-lg font-bold text-orange-500">
                    {formatPrice(mission.montantTotal)}€
                  </p>
                </div>
              </div>
            </div>

            {/* ========== LIGNE 2 ========== */}
            
            {/* Type véhicule */}
            <div className="flex items-center">
              <div className="bg-zinc-800 rounded-md sm:rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2">
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 mb-0.5">
                  <p className="text-gray-400 text-[7px] sm:text-[6px] md:text-[10px] lg:text-xs leading-tight">Type</p>
                </div>
                <p className="text-white font-semibold text-[8px] sm:text-[8px] md:text-xs lg:text-base leading-tight whitespace-nowrap">
                  {vehicleConfig.label}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center justify-center">
              <div className="bg-zinc-800 rounded-md sm:rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2">
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 mb-0.5">
                  <svg className="w-2 h-2 sm:w-3 md:w-3.5 lg:w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-[7px] sm:text-[6px] md:text-[10px] lg:text-xs leading-tight">Date</p>
                </div>
                <p className="text-white font-semibold text-[8px] sm:text-[8px] md:text-xs lg:text-base leading-tight whitespace-nowrap">
                  {formatDateRange(mission.dateDebut, mission.dateDepartMax)}
                </p>
              </div>
            </div>
            
            <div></div>

            {/* Péage */}
            <div className="flex items-center flex-shrink-0">
              <div className="bg-zinc-800 rounded-md px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2 md:py-1">
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1 mb-0.5 md:mb-1">
                  <svg className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-gray-400" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-400 text-[7px] sm:text-[8px] md:text-xs leading-tight">Péage</p>
                </div>
                <p className="text-white font-semibold text-[8px] sm:text-[9px] md:text-sm leading-tight">
                  {formatPrice(mission.fraisPeage)}€
                </p>
              </div>
            </div>

            <div className="col-span-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
