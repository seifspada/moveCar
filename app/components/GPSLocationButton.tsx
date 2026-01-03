// components/GPSLocationButton.tsx
"use client";

import { useState, useCallback } from "react";
import { MapPin } from "lucide-react";

interface CoordonneesGPS {
  latitude: number;
  longitude: number;
}

interface GPSLocationButtonProps {
  position: CoordonneesGPS;
  onPositionChange: (position: CoordonneesGPS) => void;
  className?: string;
}

export default function GPSLocationButton({ 
  position, 
  onPositionChange,
  className = ""
}: GPSLocationButtonProps) {
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);

  const positionFormatted = `${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`;

  const handleGetPosition = useCallback(() => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLoadingPosition(true);
   navigator.geolocation.getCurrentPosition(
  (pos) => {
    console.log("Accuracy (m):", pos.coords.accuracy);

    onPositionChange({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    });

    setIsLoadingPosition(false);
  },
  (error) => {
    let errorMessage = "Impossible d'obtenir la position GPS";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Permission de géolocalisation refusée";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Position indisponible";
        break;
      case error.TIMEOUT:
        errorMessage = "Délai d'attente dépassé";
        break;
    }

    alert(errorMessage);
    setIsLoadingPosition(false);
  },
  {
    enableHighAccuracy: true, // 🔥 Demande GPS réel
    timeout: 20000,           // ⏱️ attendre plus longtemps
    maximumAge: 1000          // ♻️ accepte une position récente (1s)
  }
);

  }, [onPositionChange]);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Position de l'incident (coordonnées GPS)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={positionFormatted}
          className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
          readOnly
          placeholder="0.000000, 0.000000"
        />
        <button
          onClick={handleGetPosition}
          disabled={isLoadingPosition}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
          title="Obtenir ma position actuelle"
        >
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          {isLoadingPosition ? "..." : "Localiser"}
        </button>
      </div>
      {position.latitude !== 0 && position.longitude !== 0 && (
        <p className="text-xs text-green-400 mt-1">
          ✓ Position enregistrée
        </p>
      )}
    </div>
  );
}