// components/mission-components/SearchFilter.tsx
"use client";

import { X, Search } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { createPortal } from "react-dom";

interface SearchFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (data: any) => void;
}

interface Commune {
  nom: string;
  centre?: {
    coordinates: [number, number]; // GeoJSON format: [lon, lat]
  };
  codesPostaux?: string[];
}

interface SelectedCity {
  name: string;
  lat: number;
  lon: number;
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
  const [debouncedDepart, setDebouncedDepart] = useState("");
  const [debouncedArrivee, setDebouncedArrivee] = useState("");
  const [selectedDepart, setSelectedDepart] = useState<SelectedCity | null>(null);
  const [selectedArrivee, setSelectedArrivee] = useState<SelectedCity | null>(null);
  const [showSuggestionsDepart, setShowSuggestionsDepart] = useState(false);
  const [showSuggestionsArrivee, setShowSuggestionsArrivee] = useState(false);

  // Autres filtres
  const [dateDepart, setDateDepart] = useState("");
  const [dateRetour, setDateRetour] = useState("");
  const [nombreKm, setNombreKm] = useState("");
  const [typeVehicule, setTypeVehicule] = useState("");
  const [montant, setMontant] = useState("");
  const [rayon, setRayon] = useState(50);

  // Refs
  const inputDepartRef = useRef<HTMLInputElement>(null);
  const inputArriveeRef = useRef<HTMLInputElement>(null);
  const suggestionsDepartRef = useRef<HTMLDivElement>(null);
  const suggestionsArriveeRef = useRef<HTMLDivElement>(null);

  // Debounce pour ville de départ
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedDepart(inputDepart), 300);
    return () => clearTimeout(timer);
  }, [inputDepart]);

  // Debounce pour ville d'arrivée
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedArrivee(inputArrivee), 300);
    return () => clearTimeout(timer);
  }, [inputArrivee]);

  // Fetch suggestions pour ville de départ
  const { data: suggestionsDepart = [], isLoading: isLoadingDepart } = useSWR<Commune[]>(
    debouncedDepart.length >= 2
      ? `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(debouncedDepart)}&fields=nom,centre,codesPostaux&format=geojson&limit=5`
      : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) return [];
      const geojson = await res.json();
      return geojson.features?.map((feature: any) => ({
        nom: feature.properties.nom,
        centre: feature.geometry,
        codesPostaux: feature.properties.codesPostaux
      })) || [];
    },
    { revalidateOnFocus: false }
  );

  // Fetch suggestions pour ville d'arrivée
  const { data: suggestionsArrivee = [], isLoading: isLoadingArrivee } = useSWR<Commune[]>(
    debouncedArrivee.length >= 2
      ? `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(debouncedArrivee)}&fields=nom,centre,codesPostaux&format=geojson&limit=5`
      : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) return [];
      const geojson = await res.json();
      return geojson.features?.map((feature: any) => ({
        nom: feature.properties.nom,
        centre: feature.geometry,
        codesPostaux: feature.properties.codesPostaux
      })) || [];
    },
    { revalidateOnFocus: false }
  );

  const handleSelectDepart = useCallback((commune: Commune) => {
    if (!commune.centre || !commune.centre.coordinates) return;
    const [lon, lat] = commune.centre.coordinates;
    if (typeof lon !== 'number' || typeof lat !== 'number' || isNaN(lon) || isNaN(lat)) return;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return;
    
    setSelectedDepart({ name: commune.nom, lat, lon });
    setInputDepart(commune.nom);
    setShowSuggestionsDepart(false);
  }, []);

  const handleSelectArrivee = useCallback((commune: Commune) => {
    if (!commune.centre || !commune.centre.coordinates) return;
    const [lon, lat] = commune.centre.coordinates;
    if (typeof lon !== 'number' || typeof lat !== 'number' || isNaN(lon) || isNaN(lat)) return;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return;
    
    setSelectedArrivee({ name: commune.nom, lat, lon });
    setInputArrivee(commune.nom);
    setShowSuggestionsArrivee(false);
  }, []);

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

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsDepartRef.current && 
        !suggestionsDepartRef.current.contains(e.target as Node) &&
        inputDepartRef.current &&
        !inputDepartRef.current.contains(e.target as Node)
      ) {
        setShowSuggestionsDepart(false);
      }
      if (
        suggestionsArriveeRef.current && 
        !suggestionsArriveeRef.current.contains(e.target as Node) &&
        inputArriveeRef.current &&
        !inputArriveeRef.current.contains(e.target as Node)
      ) {
        setShowSuggestionsArrivee(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      setShowSuggestionsDepart(false);
      setShowSuggestionsArrivee(false);
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
          {/* Villes avec autocomplete */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ville de départ */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ville de départ
              </label>
              <input
                ref={inputDepartRef}
                type="text"
                value={inputDepart}
                onChange={(e) => {
                  setInputDepart(e.target.value);
                  if (selectedDepart) setSelectedDepart(null);
                  setShowSuggestionsDepart(true);
                }}
                onFocus={() => inputDepart.length >= 2 && setShowSuggestionsDepart(true)}
                placeholder="Ex: Paris"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              
             {showSuggestionsDepart && inputDepart.length >= 2 &&
  createPortal(
    <div
      ref={suggestionsDepartRef}
      className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      style={{
        top: inputDepartRef.current?.getBoundingClientRect().bottom,
        left: inputDepartRef.current?.getBoundingClientRect().left,
        width: inputDepartRef.current?.offsetWidth,
      }}
    >
      {isLoadingDepart ? (
        <div className="px-4 py-3 text-gray-400">Chargement...</div>
      ) : suggestionsDepart.length === 0 ? (
        <div className="px-4 py-3 text-gray-400">Aucun résultat</div>
      ) : (
        suggestionsDepart.map((commune, idx) => (
          <button
            key={`depart-${commune.nom}-${idx}`}
            onClick={() => handleSelectDepart(commune)}
            className="w-full px-4 py-3 text-left text-white hover:bg-zinc-700 transition-colors"
          >
            {commune.nom}
            {commune.codesPostaux?.[0] && (
              <span className="text-gray-400 text-sm ml-2">
                ({commune.codesPostaux[0]})
              </span>
            )}
          </button>
        ))
      )}
    </div>,
    document.body
  )
}
            </div>

            {/* Ville d'arrivée */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ville d'arrivée
              </label>
              <input
                ref={inputArriveeRef}
                type="text"
                value={inputArrivee}
                onChange={(e) => {
                  setInputArrivee(e.target.value);
                  if (selectedArrivee) setSelectedArrivee(null);
                  setShowSuggestionsArrivee(true);
                }}
                onFocus={() => inputArrivee.length >= 2 && setShowSuggestionsArrivee(true)}
                placeholder="Ex: Lyon"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              
 {showSuggestionsArrivee && inputArrivee.length >= 2 &&
  createPortal(
    <div
      ref={suggestionsArriveeRef}
      className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      style={{ top: inputArriveeRef.current?.getBoundingClientRect().bottom, left: inputArriveeRef.current?.getBoundingClientRect().left, width: inputArriveeRef.current?.offsetWidth }}
    >
      {isLoadingArrivee ? (
        <div className="px-4 py-3 text-gray-400">Chargement...</div>
      ) : suggestionsArrivee.length === 0 ? (
        <div className="px-4 py-3 text-gray-400">Aucun résultat</div>
      ) : (
        suggestionsArrivee.map((commune, idx) => (
          <button
            key={`arrivee-${commune.nom}-${idx}`}
            onClick={() => handleSelectArrivee(commune)}
            className="w-full px-4 py-3 text-left text-white hover:bg-zinc-700 transition-colors"
          >
            {commune.nom}
            {commune.codesPostaux?.[0] && (
              <span className="text-gray-400 text-sm ml-2">({commune.codesPostaux[0]})</span>
            )}
          </button>
        ))
      )}
    </div>,
    document.body
  )
}
            </div>
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