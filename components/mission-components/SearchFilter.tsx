// components/mission-components/SearchFilter.tsx
"use client";

import { X, Search, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { CityAutocomplete, type SelectedCity } from "./CityAutocomplete";
import { toast } from "sonner";

// ✅ AJOUTER LE MODE DEBUG
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

const log = (...args: any[]) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

export interface SearchFilterProps { 
  isOpen: boolean;
  onClose: () => void;
  onSearch: (data: any) => void;
  userId: number;
}

const MapComponent = dynamic(() => import("./MapComponent").then(mod => mod.default), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-zinc-800">
      <div className="text-gray-400">Chargement de la carte...</div>
    </div>
  )
});

// ✅ Type pour les états sauvegardés
interface SavedFilterState {
  inputDepart: string;
  inputArrivee: string;
  selectedDepart: SelectedCity | null;
  selectedArrivee: SelectedCity | null;
  dateDepart: string;
  dateRetour: string;
  rayon: number;
}

const STORAGE_KEY = 'search-filter-state';

export function SearchFilter({ isOpen, onClose, onSearch, userId }: SearchFilterProps) {
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

  // Alerte
  const [alertActive, setAlertActive] = useState(false);
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);

  // ✅ Charger les états sauvegardés au montage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed: SavedFilterState = JSON.parse(savedState);
        setInputDepart(parsed.inputDepart || "");
        setInputArrivee(parsed.inputArrivee || "");
        setSelectedDepart(parsed.selectedDepart);
        setSelectedArrivee(parsed.selectedArrivee);
        setDateDepart(parsed.dateDepart || "");
        setDateRetour(parsed.dateRetour || "");
        setRayon(parsed.rayon || 50);
        
        // ✅ REMPLACER console.log par log
        log('✅ États restaurés:', parsed);
      } catch (error) {
        console.error('❌ Erreur lors de la restauration:', error); // ✅ Garder console.error
      }
    }
  }, []);

  // ✅ Sauvegarder les états à chaque changement
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stateToSave: SavedFilterState = {
      inputDepart,
      inputArrivee,
      selectedDepart,
      selectedArrivee,
      dateDepart,
      dateRetour,
      rayon,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [inputDepart, inputArrivee, selectedDepart, selectedArrivee, dateDepart, dateRetour, rayon]);

  // Créer l'alerte trajet
  const createAlert = async () => {
    if (!selectedDepart || !selectedArrivee || !alertActive) return;

    setIsCreatingAlert(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Vous devez être connecté pour créer une alerte');
        return;
      }

      const response = await fetch('/api/mission/alertes-missions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
  type: 'TRAJET',
  villeDepartNom: selectedDepart.name,
  latitudeDepart: selectedDepart.lat,
  longitudeDepart: selectedDepart.lon,
  villeArriveeNom: selectedArrivee.name,
  latitudeArrivee: selectedArrivee.lat,
  longitudeArrivee: selectedArrivee.lon,
  rayon: rayon,
  dateDepart: dateDepart || undefined,
  dateDepartMax: dateRetour || undefined,  // ← renommer dateRetour en dateDepartMax
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de l\'alerte');
      }

      toast.success(`🔔 Alerte créée pour le trajet ${selectedDepart.name} → ${selectedArrivee.name} (${rayon} km)`);
      log('✅ Alerte créée:', data.data); // ✅ REMPLACER console.log par log
    } catch (error: any) {
      console.error('❌ Erreur création alerte:', error); // ✅ Garder console.error
      toast.error(error.message || 'Erreur lors de la création de l\'alerte');
    } finally {
      setIsCreatingAlert(false);
    }
  };

  const handleSearch = async () => {
    // Créer l'alerte si activée et les 2 villes sont sélectionnées
    if (alertActive && selectedDepart && selectedArrivee) {
      await createAlert();
    }

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

  // ✅ Fonction pour effacer les filtres
  const handleClearFilters = () => {
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
    setAlertActive(false);
    
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Filtres effacés');
  };

  if (!isOpen) return null;

  // Préparer les points pour la carte
  const mapPoints = [];
  if (selectedDepart && selectedArrivee) {
    mapPoints.push({
      position: [selectedDepart.lat, selectedDepart.lon] as [number, number],
      radius: rayon * 1000,
      color: "#f97316",
      label: "départ"
    });
    mapPoints.push({
      position: [selectedArrivee.lat, selectedArrivee.lon] as [number, number],
      radius: rayon * 1000,
      color: "#10b981",
      label: "arrivée"
    });
  } else if (selectedDepart) {
    mapPoints.push({
      position: [selectedDepart.lat, selectedDepart.lon] as [number, number],
      radius: rayon * 1000,
      color: "#f97316",
      label: "départ"
    });
  } else if (selectedArrivee) {
    mapPoints.push({
      position: [selectedArrivee.lat, selectedArrivee.lon] as [number, number],
      radius: rayon * 1000,
      color: "#10b981",
      label: "arrivée"
    });
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[2000] pt-20 overflow-y-auto">
      <div className="bg-zinc-900 rounded-xl w-full max-w-2xl p-6 relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Search className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-white">Chercher une mission</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* ✅ Bouton Effacer */}
            {(selectedDepart || selectedArrivee) && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Effacer
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="space-y-4">
          {/* Villes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CityAutocomplete
              value={inputDepart}
              onValueChange={setInputDepart}
              selectedCity={selectedDepart}
              onSelectCity={setSelectedDepart}
              theme="dark"
              placeholder="Ex: Paris"
              label="Ville de départ"
            />

            <CityAutocomplete
              value={inputArrivee}
              onValueChange={setInputArrivee}
              selectedCity={selectedArrivee}
              onSelectCity={setSelectedArrivee}
              theme="dark"
              placeholder="Ex: Lyon"
              label="Ville d'arrivée"
            />
          </div>

          {/* Carte */}
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

          {/* Alerte trajet */}
          {selectedDepart && selectedArrivee && (
            <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-yellow-500" />
                <div>
                  <span className="text-white font-medium block">Activer l'alerte trajet</span>
                  <span className="text-xs text-gray-400">
                    Notification pour {selectedDepart.name} → {selectedArrivee.name}
                  </span>
                </div>
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
          )}

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
            disabled={isCreatingAlert}
            className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isCreatingAlert ? 'Création...' : 'Rechercher'}
          </button>
        </div>
      </div>
    </div>
  );
}
