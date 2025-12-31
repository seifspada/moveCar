// app/components/MissionCard.tsx
'use client';

import { Mission, vehicleIcons, VehicleType, vehiculeCarburantIcons, VehiculeCarburant } from "@/app/data/missions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MissionCard({ mission }: { mission: Mission }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const vehicleConfig = vehicleIcons[mission.vehicleType as VehicleType] || vehicleIcons.berline;
  const fuelInfo = vehiculeCarburantIcons[mission.typeCarburant as VehiculeCarburant] || vehiculeCarburantIcons.Essence;

  const handleCardClick = () => {
    router.push(`/adherant/mission-reservation/${mission.id}`);
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
      {/* LAYOUT HORIZONTAL - Mobile et Desktop */}
      <div className="flex flex-row items-stretch h-full">
        {/* Section gauche : Icône du véhicule + Icône carburant */}
        <div className="relative w-16 sm:w-20 md:w-24 lg:w-32 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center p-2 sm:p-2.5 md:p-3 lg:p-4 flex-shrink-0">
          {/* Icône du véhicule */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center p-1 sm:p-1.5 lg:p-2 shadow-lg">
            <Image
              src={vehicleConfig.image}
              alt={vehicleConfig.label}
              width={70}
              height={70}
              className="object-contain"
            />
          </div>
          
        <div
  className="absolute top-0 right-0
             w-8 h-8 md:w-10 md:h-10
             bg-white rounded-full
             flex items-center justify-center
             p-0.5"
>
  <Image
    src={fuelInfo.image}
    alt={fuelInfo.label}
    width={32}
    height={32}
    className="object-contain w-full h-full"
  />
</div>

        </div>

        {/* Section centrale et droite : Informations */}
        <div className="flex-1 flex flex-col justify-between p-2 sm:p-3 md:p-4 lg:p-6 min-w-0">
          {/* Première ligne : Villes (Départ → Arrivée) */}
          <div className="flex items-center justify-start gap-4 sm:gap-6 lg:gap-8 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
            {/* Ville de départ */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs leading-tight">Départ</p>
                <p className="text-white font-bold text-[11px] sm:text-xs md:text-sm lg:text-lg leading-tight truncate">{mission.villeDepart}</p>
              </div>
            </div>

            {/* Flèche horizontale */}
            <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-16 lg:h-16 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Ville d'arrivée */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs leading-tight">Arrivée</p>
                <p className="text-white font-bold text-[11px] sm:text-xs md:text-sm lg:text-lg leading-tight truncate">{mission.villeArrivee}</p>
              </div>
            </div>
          </div>

          {/* Deuxième ligne : Informations détaillées */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-3 lg:gap-6">
            {/* Type de véhicule */}
            <div className="flex-shrink-0 hidden md:block">
              <div className="bg-zinc-800 rounded-md sm:rounded-lg px-1.5 py-1 sm:px-2 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2">
                <p className="text-gray-400 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs mb-0.5 leading-tight">Type</p>
                <p className="text-white font-semibold text-[9px] sm:text-[7px] md:text-xs lg:text-base leading-tight">{vehicleConfig.label}</p>
                <p className="text-gray-500 text-[7px] sm:text-[6px] md:text-[9px] lg:text-xs leading-tight hidden md:block">{vehicleConfig.examples}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex-shrink-0">
              <div className="bg-zinc-800 rounded-md sm:rounded-lg px-1.5 py-1 sm:px-2 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2">
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 mb-0.5">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-[8px] sm:text-[6px] md:text-[10px] lg:text-xs leading-tight">Date</p>
                </div>
                <p className="text-white font-semibold text-[9px] sm:text-[8px] md:text-xs lg:text-base leading-tight whitespace-nowrap">{mission.dateDisposition}</p>
              </div>
            </div>

            {/* Distance */}
            <div className="flex-shrink-0">
              <div className="bg-zinc-800 rounded-md sm:rounded-lg px-1.5 py-1 sm:px-2 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2">
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 mb-0.5">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="text-gray-400 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs leading-tight">Km</p>
                </div>
                <p className="text-white font-semibold text-[9px] sm:text-[10px] md:text-xs lg:text-base leading-tight">{mission.nbKm}</p>
              </div>
            </div>

            {/* Péage */}
            <div className="flex-shrink-0">
              <div className="bg-zinc-800 rounded-md sm:rounded-lg px-1.5 py-1 sm:px-2 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2">
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 mb-0.5">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-400 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs leading-tight">Péage</p>
                </div>
                <p className="text-white font-semibold text-[9px] sm:text-[10px] md:text-xs lg:text-base leading-tight">{mission.fraisPeage}</p>
              </div>
            </div>

            {/* Container pour favorite et montant */}
            <div className="flex flex-col items-end justify-between flex-shrink-0 min-w-[70px] sm:min-w-[85px] md:min-w-[100px] lg:min-w-[120px]">
              {/* Étoile favorite */}
              <button
                onClick={handleFavoriteClick}
                className="transition-all duration-200 hover:scale-110 -mt-9 mb-4"
                aria-label="Ajouter aux favoris"
              >
                <svg
                  className={`w-5 h-5 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-10 lg:h-10 transition-colors duration-200 ${isFavorite
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

              {/* Montant */}
              <div className="relative rounded-md sm:rounded-lg overflow-hidden px-2 py-1.5 sm:px-2.5 sm:py-5 md:px-4 md:py-2 lg:px-6 lg:py-2 w-full">
                <Image
                  src="/images/bg-montant.png"
                  alt="Background"
                  fill
                  className="object-cover object-center opacity-20"
                  priority
                />
                <div className="relative flex flex-col items-center">
                  <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2 mb-0.5">
                    <span className="text-yellow-400 text-[9px] sm:text-[10px] md:text-xs lg:text-base">★</span>
                    <p className="text-gray-300 text-[7px] sm:text-[8px] md:text-[9px] lg:text-xs font-medium leading-tight">Total</p>
                  </div>
                  <p className="text-[11px] sm:text-xs md:text-base lg:text-2xl font-bold text-orange-500 leading-tight">
                    {mission.montant.toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}