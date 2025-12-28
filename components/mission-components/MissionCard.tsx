// app/components/MissionCard.tsx
'use client';

import { Mission, vehicleIcons, VehicleType, fuelConfig } from "@/app/data/missions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MissionCard({ mission }: { mission: Mission }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const vehicleConfig = vehicleIcons[mission.vehicleType as VehicleType] || vehicleIcons.berline;
  const fuelInfo = fuelConfig[mission.typeCarburant];
  const FuelIcon = fuelInfo.IconType;
  
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
      className="bg-zinc-900 rounded-xl shadow-lg border-2 border-zinc-800 hover:border-orange-500 transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* MOBILE LAYOUT - Stacked vertically */}
      <div className="md:hidden">
        {/* Header with vehicle icon and favorite */}
        <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600 p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-2">
              <Image 
                src={vehicleConfig.image}
                alt={vehicleConfig.label}
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium">Véhicule</p>
              <p className="text-white font-bold text-sm">{vehicleConfig.label}</p>
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="transition-all duration-200 hover:scale-110"
            aria-label="Ajouter aux favoris"
          >
            <svg 
              className={`w-7 h-7 transition-colors duration-200 ${
                isFavorite 
                  ? 'fill-white text-white' 
                  : 'fill-none text-white/70 hover:text-white'
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

        {/* Route section */}
        <div className="p-4 bg-zinc-800/50">
          <div className="flex items-center gap-3">
            {/* Departure */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-xs font-medium">Départ</p>
              </div>
              <p className="text-white font-bold text-base ml-8">{mission.villeDepart}</p>
            </div>

            {/* Arrow */}
            <svg className="w-8 h-8 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Arrival */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-xs font-medium">Arrivée</p>
              </div>
              <div className="flex items-center gap-2 ml-8">
                <p className="text-white font-bold text-base">{mission.villeArrivee}</p>
                <div 
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${fuelInfo.color}20` }}
                  title={fuelInfo.label}
                >
                  <FuelIcon size={14} color={fuelInfo.color} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {/* Date */}
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-xs">Date</p>
            </div>
            <p className="text-white font-semibold text-sm">{mission.dateDisposition}</p>
          </div>

          {/* Distance */}
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-gray-400 text-xs">Distance</p>
            </div>
            <p className="text-white font-semibold text-sm">{mission.nbKm} km</p>
          </div>

          {/* Péage */}
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-400 text-xs">Péage</p>
            </div>
            <p className="text-white font-semibold text-sm">{mission.fraisPeage}</p>
          </div>

          {/* Montant */}
          <div className="relative rounded-lg overflow-hidden p-3">
            <Image
              src="/images/bg-montant.png"
              alt="Background"
              fill
              className="object-cover object-center opacity-20"
              priority
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400 text-sm">★</span>
                <p className="text-gray-300 text-xs font-medium">Montant</p>
              </div>
              <p className="text-xl font-bold text-orange-500">{mission.montant.toFixed(2)} €</p>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT - Original horizontal layout */}
      <div className="hidden md:flex items-stretch">
        {/* Section gauche : Icône du véhicule */}
        <div className="w-32 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center p-4 flex-shrink-0">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-2">
            <Image 
              src={vehicleConfig.image}
              alt={vehicleConfig.label}
              width={70}
              height={70}
              className="object-contain"
            />
          </div>
        </div>

        {/* Section centrale : Toutes les informations */}
        <div className="flex-1 p-6">
          {/* Première ligne : Villes (Départ → Arrivée) */}
          <div className="flex items-center justify-between gap-8 mb-6">
            {/* Ville de départ */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs">Départ</p>
                <p className="text-white font-bold text-lg truncate">{mission.villeDepart}</p>
              </div>
            </div>

            {/* Flèche */}
            <svg className="w-16 h-16 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Ville d'arrivée avec icône carburant */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-xs">Arrivée</p>
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold text-lg truncate">{mission.villeArrivee}</p>
                  <div 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${fuelInfo.color}20` }}
                    title={fuelInfo.label}
                  >
                    <FuelIcon size={16} color={fuelInfo.color} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deuxième ligne : Type de véhicule et informations */}
          <div className="flex items-center justify-between gap-6">
            {/* Type de véhicule */}
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 rounded-lg px-4 py-2">
                <p className="text-gray-400 text-xs mb-0.5">Type de véhicule</p>
                <p className="text-white font-semibold text-base leading-tight">{vehicleConfig.label}</p>
                <p className="text-gray-500 text-xs leading-tight">{vehicleConfig.examples}</p>
              </div>

            </div>
            
            {/* Date */}
            <div className="bg-zinc-800 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 mb-0.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 text-xs">Date</p>
              </div>
              <p className="text-white font-semibold text-base leading-tight">{mission.dateDisposition}</p>
            </div>
           
            {/* Distance */}
            <div className="bg-zinc-800 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 mb-0.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-gray-400 text-xs">Distance</p>
              </div>
              <p className="text-white font-semibold text-base leading-tight">{mission.nbKm} km</p>
            </div>

            {/* Péage */}
            <div className="bg-zinc-800 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 mb-0.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-400 text-xs">Péage</p>
              </div>
              <p className="text-white font-semibold text-base leading-tight">{mission.fraisPeage}</p>
            </div>

            {/* Container pour favorite et montant */}
            <div className="flex flex-col gap-2">
              {/* Étoile favorite en haut */}
              <button
                onClick={handleFavoriteClick}
                className="self-end transition-all duration-200 hover:scale-110"
                aria-label="Ajouter aux favoris"
              >
                <svg 
                  className={`w-10 h-10 md:-mt-20 transition-colors duration-200 ${
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

              {/* Montant en bas */}
              <div className="relative rounded-lg overflow-hidden px-6 py-2">
                <Image
                  src="/images/bg-montant.png"
                  alt="Background"
                  fill
                  className="object-cover object-center opacity-20"
                  priority
                />
                <div className="relative flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-yellow-400 text-lg">★</span>
                    <p className="text-gray-300 text-xs font-medium">Montant total</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-500 leading-tight">
                    {mission.montant.toFixed(2)} €
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