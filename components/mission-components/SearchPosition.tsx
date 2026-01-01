// components/mission-components/SearchPosition.tsx
"use client";

import { X, MapPin, Bell } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback } from "react";
import { CityAutocomplete, type SelectedCity } from "./CityAutocomplete";

interface SearchPositionProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (data: { city: SelectedCity | null; radius: number; alert: boolean }) => void;
}

// Dynamic import du composant Map pour éviter les problèmes SSR
const MapComponent = dynamic(() => import("./MapComponent").then(mod => mod.default), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-zinc-800">
      <div className="text-gray-400">Chargement de la carte...</div>
    </div>
  )
});

export function SearchPosition({ isOpen, onClose, onSearch }: SearchPositionProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);
  const [radius, setRadius] = useState(50);
  const [alertActive, setAlertActive] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(() => {
    if (!selectedCity) return;
    onSearch({ city: selectedCity, radius, alert: alertActive });
    onClose();
  }, [selectedCity, radius, alertActive, onSearch, onClose]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Reset quand le modal ferme
  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setSelectedCity(null);
      setRadius(50);
      setAlertActive(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-zinc-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-white">
              Missions autour de moi
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenu */}
        <div className="space-y-6">
          {/* Ville avec autocomplete - Composant réutilisable */}
          <CityAutocomplete
            value={inputValue}
            onValueChange={setInputValue}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            theme="dark" // ou ne pas spécifier (dark par défaut)

            placeholder="Entrez votre ville (min. 2 caractères)"
            label="Ville"
          />

          {/* Map - Affiche la France par défaut, puis la ville sélectionnée */}
          <div className="h-96 rounded-lg overflow-hidden border border-zinc-700">
            <MapComponent 
              center={selectedCity ? [selectedCity.lat, selectedCity.lon] : [46.603354, 1.888334]}
              radius={selectedCity ? radius * 1000 : undefined}
              zoom={selectedCity ? undefined : 6}
            />
          </div>

          {/* Rayon */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rayon de recherche : {radius} km
            </label>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10 km</span>
              <span>300 km</span>
            </div>
          </div>

          {/* Alerte */}
          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-yellow-500" />
              <span className="text-white font-medium">Activer l'alerte</span>
            </div>
            <button
              onClick={() => setAlertActive(!alertActive)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                alertActive ? "bg-orange-500" : "bg-zinc-600"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  alertActive ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSearch}
            disabled={!selectedCity}
            className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Rechercher
          </button>
        </div>
      </div>
    </div>
  );
}