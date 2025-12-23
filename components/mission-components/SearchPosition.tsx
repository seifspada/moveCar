// components/mission-components/SearchPosition.tsx
"use client";

import { X, MapPin, Bell } from "lucide-react";
import { useState } from "react";

interface SearchPositionProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (data: any) => void;
}

export function SearchPosition({ isOpen, onClose, onSearch }: SearchPositionProps) {
  const [ville, setVille] = useState("");
  const [rayon, setRayon] = useState(50);
  const [alerteActive, setAlerteActive] = useState(false);

  const handleSearch = () => {
    onSearch({ ville, rayon, alerteActive });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-white">Missions autour de moi</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenu */}
        <div className="space-y-5">
          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ville
            </label>
            <input
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              placeholder="Entrez votre ville"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Rayon */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rayon de recherche : {rayon} km
            </label>
            <input
              type="range"
              min="0"
              max="300"
              step="10"
              value={rayon}
              onChange={(e) => setRayon(Number(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 km</span>
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
              onClick={() => setAlerteActive(!alerteActive)}
              className={`w-12 h-6 rounded-full transition-colors ${
                alerteActive ? "bg-orange-500" : "bg-zinc-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  alerteActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSearch}
            className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
          >
            Rechercher
          </button>
        </div>
      </div>
    </div>
  );
}
