// components/mission-components/SearchFilter.tsx
"use client";

import { X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { CityAutocomplete, type SelectedCity } from "./CityAutocomplete";

interface SearchFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (data: any) => void;
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

export function SearchFilter({ isOpen, onClose, onSearch }: SearchFilterProps) {
  // Villes
  const [inputDepart, setInputDepart] = useState("");
  const [inputArrivee, setInputArrivee] = useState("");
  const [selectedDepart, setSelectedDepart] = useState<SelectedCity | null>(null);
  const [selectedArrivee, setSelectedArrivee] = useState<SelectedCity | null>(null);

  // Autres filtres
  const [dateDepart, setDateDepart] = useState("");
  const [dateRetour, setDateRetour] = useState("");
  const [nombreKm, setNombreKm] = useState("");
  const [typeVehicule, setTypeVehicule] = useState("");
  const [montant, setMontant] = useState("");
  const [rayon, setRayon] = useState(50);

  const handleSearch = () => {
    onSearch({
      villeDepart: selectedDepart,
      villeArrivee: selectedArrivee,
      dateDepart,
      dateRetour,
      nombreKm,
      typeVehicule,
      montant,
      rayon,
    });
    onClose();
  };

  // Reset quand le modal ferme
  useEffect(() => {
    if (!isOpen) {
      setInputDepart("");
      setInputArrivee("");
      setSelectedDepart(null);
      setSelectedArrivee(null);
      setDateDepart("");
      setDateRetour("");
      setNombreKm("");
      setTypeVehicule("");
      setMontant("");
      setRayon(50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Préparer les points pour la carte (les deux partagent le même rayon)
  const mapPoints = [];
  if (selectedDepart && selectedArrivee) {
    // Les deux villes sont sélectionnées - afficher les deux avec le même rayon
    mapPoints.push({
      position: [selectedDepart.lat, selectedDepart.lon] as [number, number],
      radius: rayon * 1000, // Convertir km en mètres
      color: "#f97316", // Orange
      label: "départ"
    });
    mapPoints.push({
      position: [selectedArrivee.lat, selectedArrivee.lon] as [number, number],
      radius: rayon * 1000, // Même rayon
      color: "#10b981", // Vert
      label: "arrivée"
    });
  } else if (selectedDepart) {
    // Seulement départ sélectionné
    mapPoints.push({
      position: [selectedDepart.lat, selectedDepart.lon] as [number, number],
      radius: rayon * 1000,
      color: "#f97316",
      label: "départ"
    });
  } else if (selectedArrivee) {
    // Seulement arrivée sélectionnée
    mapPoints.push({
      position: [selectedArrivee.lat, selectedArrivee.lon] as [number, number],
      radius: rayon * 1000,
      color: "#10b981",
      label: "arrivée"
    });
  }

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
          {/* Villes avec autocomplete - Composants réutilisables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ville de départ */}
            <CityAutocomplete
              value={inputDepart}
              onValueChange={setInputDepart}
              selectedCity={selectedDepart}
              onSelectCity={setSelectedDepart}
              theme="dark" // ou ne pas spécifier (dark par défaut)

              placeholder="Ex: Paris"
              label="Ville de départ"
            />

            {/* Ville d'arrivée */}
            <CityAutocomplete
              value={inputArrivee}
              onValueChange={setInputArrivee}
              selectedCity={selectedArrivee}
              onSelectCity={setSelectedArrivee}
              theme="dark" // ou ne pas spécifier (dark par défaut)

              placeholder="Ex: Lyon"
              label="Ville d'arrivée"
            />
          </div>

          {/* Carte - Affichée seulement si au moins une ville est sélectionnée */}
          {mapPoints.length > 0 && (
            <div className="h-96 rounded-lg overflow-hidden border border-zinc-700">
              <MapComponent points={mapPoints} />
            </div>
          )}

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