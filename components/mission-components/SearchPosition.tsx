// components/mission-components/SearchPosition.tsx
"use client";

import { X, MapPin, Bell } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { CityAutocomplete, SelectedCity } from "./CityAutocomplete";

const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
const log = (...args: any[]) => { if (DEBUG_MODE) console.log(...args); };

interface SearchPositionProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (data: { 
    city: SelectedCity; 
    radius: number;
  }) => void;
  userId: number;
}

const MapComponent = dynamic(() => import("./MapComponent").then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-zinc-800">
      <div className="text-gray-400">Chargement de la carte...</div>
    </div>
  ),
});

interface SavedPositionState {
  inputValue: string;
  selectedCity: SelectedCity | null;
  radius: number;
  dateDepart: string;      // ← ajout
  dateDepartMax: string;   // ← ajout
}

const STORAGE_KEY = 'search-position-state';

export function SearchPosition({ isOpen, onClose, onSearch, userId }: SearchPositionProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);
  const [radius, setRadius] = useState(10);
  const [alertActive, setAlertActive] = useState(false);
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [dateDepart, setDateDepart] = useState("");        // ← ajout
  const [dateDepartMax, setDateDepartMax] = useState(""); // ← ajout

  const modalRef = useRef<HTMLDivElement>(null);

  // Charger les états sauvegardés au montage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed: SavedPositionState = JSON.parse(savedState);
        setInputValue(parsed.inputValue || "");
        setSelectedCity(parsed.selectedCity);
        setRadius(parsed.radius || 10);
        setDateDepart(parsed.dateDepart || "");           // ← ajout
        setDateDepartMax(parsed.dateDepartMax || "");     // ← ajout
        log('✅ États restaurés (position):', parsed);
      } catch (error) {
        console.error('❌ Erreur lors de la restauration:', error);
      }
    }
  }, []);

  // Sauvegarder les états à chaque changement
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      inputValue,
      selectedCity,
      radius,
      dateDepart,      // ← ajout
      dateDepartMax,   // ← ajout
    }));
  }, [inputValue, selectedCity, radius, dateDepart, dateDepartMax]); // ← ajout deps

  const getZoomFromRadius = useCallback((radiusKm: number): number => {
    if (radiusKm <= 20) return 10;
    if (radiusKm <= 50) return 9;
    if (radiusKm <= 100) return 8;
    if (radiusKm <= 150) return 7;
    return 6;
  }, []);

  const createAlert = useCallback(async () => {
    if (!selectedCity || !alertActive) return true;
    setIsCreatingAlert(true);
    const toastId = toast.loading("Création de l'alerte...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vous devez être connecté pour créer une alerte", { id: toastId });
        return false;
      }

      const payload = {
        type: "GEOGRAPHIQUE",
        villeNom: selectedCity.name,
        latitude: selectedCity.lat,
        longitude: selectedCity.lon,
        rayon: radius,
        emailActif: true,                              // ← ajout
        dateDepart: dateDepart || undefined,           // ← ajout
        dateDepartMax: dateDepartMax || undefined,     // ← ajout
      };

      log('📤 Création alerte:', payload);

      const response = await fetch("/api/mission/alertes-missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          data?.error ||
          data?.message ||
          data?.details?.message ||
          "Erreur lors de la création de l'alerte";
        throw new Error(message);
      }

      toast.success(`Alerte créée pour ${selectedCity.name} (${radius} km)`, { id: toastId });
      return true;
    } catch (error: any) {
      console.error("❌ Erreur création alerte:", error);
      toast.error(error.message || "Erreur lors de la création de l'alerte", { id: toastId });
      return false;
    } finally {
      setIsCreatingAlert(false);
    }
  }, [selectedCity, radius, alertActive, dateDepart, dateDepartMax]); // ← ajout deps

  const handleSearch = useCallback(async () => {
    if (!selectedCity) {
      toast.warning("Veuillez sélectionner une ville");
      return;
    }
    try {
      if (alertActive) {
        const alertCreated = await createAlert();
        if (!alertCreated) return;
      }
      onSearch({ city: selectedCity, radius });
      onClose();
    } catch (error) {
      console.error("❌ Erreur:", error);
    }
  }, [selectedCity, radius, alertActive, createAlert, onSearch, onClose]);

  const handleClearFilters = () => {
    setInputValue("");
    setSelectedCity(null);
    setRadius(10);
    setAlertActive(false);
    setDateDepart("");       // ← ajout
    setDateDepartMax("");    // ← ajout
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Filtres effacés');
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const zoom = selectedCity ? getZoomFromRadius(radius) : 5;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[3000] p-3"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-zinc-900 rounded-xl w-full max-w-2xl max-h-[90vh] p-6 relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-white">Missions autour de moi</h2>
          </div>
          <div className="flex items-center gap-2">
            {selectedCity && (
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
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <CityAutocomplete
            value={inputValue}
            onValueChange={setInputValue}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            theme="dark"
            placeholder="Entrez votre ville (min. 2 caractères)"
            label="Ville"
          />

          <div className="h-80 rounded-lg overflow-hidden border border-zinc-700">
            {isOpen && (
              <MapComponent
                center={selectedCity ? [selectedCity.lat, selectedCity.lon] : [46.603354, 1.888334]}
                radius={selectedCity ? radius * 1000 : undefined}
                zoom={zoom}
                points={selectedCity ? [{
                  position: [selectedCity.lat, selectedCity.lon] as [number, number],
                  radius: radius * 1000,
                  color: "#f97316",
                  label: selectedCity.name
                }] : undefined}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rayon de recherche :{" "}
              <span className="text-orange-500 font-bold">{radius} km</span>
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

          {/* ← ajout : champs dates, visibles uniquement si alerte activée */}
          {selectedCity && alertActive && (
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
                  Date limite de départ
                </label>
                <input
                  type="date"
                  value={dateDepartMax}
                  onChange={(e) => setDateDepartMax(e.target.value)}
                  min={dateDepart || undefined}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {selectedCity && (
            <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-yellow-500" />
                <div>
                  <span className="text-white font-medium block">Activer l'alerte</span>
                  <span className="text-xs text-gray-400">
                    Recevoir un email pour chaque nouvelle mission près de {selectedCity.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAlertActive(!alertActive)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  alertActive ? "bg-orange-500" : "bg-zinc-600"
                }`}
                aria-label={alertActive ? "Désactiver l'alerte" : "Activer l'alerte"}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    alertActive ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSearch}
            disabled={!selectedCity || isCreatingAlert}
            className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isCreatingAlert ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Création...
              </span>
            ) : (
              "Rechercher"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
