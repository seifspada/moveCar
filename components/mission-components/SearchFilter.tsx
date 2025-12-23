
// components/mission-components/SearchFilter.tsx
"use client";

import { X, Search } from "lucide-react";
import { useState } from "react";

interface SearchFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (data: any) => void;
}

export function SearchFilter({ isOpen, onClose, onSearch }: SearchFilterProps) {
  const [villeDepart, setVilleDepart] = useState("");
  const [villeArrivee, setVilleArrivee] = useState("");
  const [dateDepart, setDateDepart] = useState("");
  const [dateRetour, setDateRetour] = useState("");
  const [nombreKm, setNombreKm] = useState("");
  const [typeVehicule, setTypeVehicule] = useState("");
  const [montant, setMontant] = useState("");
  const [rayon, setRayon] = useState(50);

  const handleSearch = () => {
    onSearch({
      villeDepart,
      villeArrivee,
      dateDepart,
      dateRetour,
      nombreKm,
      typeVehicule,
      montant,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-zinc-900 rounded-xl w-full max-w-2xl p-6 relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Search className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-white">Chercher une mission</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenu */}
        <div className="space-y-4">
          {/* Villes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ville de départ
              </label>
              <input
                type="text"
                value={villeDepart}
                onChange={(e) => setVilleDepart(e.target.value)}
                placeholder="Ex: Paris"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ville d'arrivée
              </label>
              <input
                type="text"
                value={villeArrivee}
                onChange={(e) => setVilleArrivee(e.target.value)}
                placeholder="Ex: Lyon"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
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

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date de départ souhaitée
              </label>
              <input
                type="date"
                value={dateDepart}
                onChange={(e) => setDateDepart(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date de retour (optionnelle)
              </label>
              <input
                type="date"
                value={dateRetour}
                onChange={(e) => setDateRetour(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
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