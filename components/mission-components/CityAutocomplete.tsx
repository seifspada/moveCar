"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";

interface Commune {
  nom: string;
  centre?: {
    coordinates: [number, number]; // GeoJSON format: [lon, lat]
  };
  codesPostaux?: string[];
}

export interface SelectedCity {
  name: string;
  lat: number;
  lon: number;
}

interface CityAutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  selectedCity: SelectedCity | null;
  onSelectCity: (city: SelectedCity | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  theme?: "dark" | "light";
}

export function CityAutocomplete({
  value,
  onValueChange,
  selectedCity,
  onSelectCity,
  placeholder = "Entrez votre ville (min. 2 caractères)",
  label = "Ville",
  className = "",
  theme = "dark",
}: CityAutocompleteProps) {
  const [debouncedInput, setDebouncedInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update dropdown position on scroll and resize
  useEffect(() => {
    const updatePosition = () => {
      if (inputRef.current && showSuggestions) {
        const rect = inputRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    updatePosition();
    
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showSuggestions]);

  // Debounce input pour éviter trop de requêtes API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  // Fetch des suggestions (max 5) via SWR pour le cache
  const { data: suggestions = [], isLoading } = useSWR<Commune[]>(
    debouncedInput.length >= 2
      ? `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(debouncedInput)}&fields=nom,centre,codesPostaux&format=geojson&limit=5`
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

  const handleSelectCity = (commune: Commune) => {
    if (!commune.centre || !commune.centre.coordinates) return;
    
    const [lon, lat] = commune.centre.coordinates;
    
    if (typeof lon !== 'number' || typeof lat !== 'number' || isNaN(lon) || isNaN(lat)) return;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return;
    
    onSelectCity({ name: commune.nom, lat, lon });
    onValueChange(commune.nom);
    setShowSuggestions(false);
  };

  // Close suggestions on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSuggestions) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSuggestions]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Classes dynamiques selon le thème
  const themeClasses = {
    label: theme === "dark" 
      ? "text-gray-300" 
      : "text-gray-700",
    input: theme === "dark"
      ? "bg-zinc-800 border-zinc-700 text-white placeholder-gray-500"
      : "bg-white border-gray-300 text-black placeholder-gray-400",
    dropdown: theme === "dark"
      ? "bg-zinc-800 border-zinc-700"
      : "bg-white border-gray-300 shadow-xl",
    dropdownItem: theme === "dark"
      ? "text-white hover:bg-zinc-700"
      : "text-black hover:bg-gray-100",
    loadingText: theme === "dark"
      ? "text-gray-400"
      : "text-gray-500",
    postalCode: theme === "dark"
      ? "text-gray-400"
      : "text-gray-500",
  };

  return (
    <div className={`block z-[9999] ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
          {label}
          {theme === "light" && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value);
          if (selectedCity) onSelectCity(null);
          setShowSuggestions(true);
        }}
        onFocus={() => value.length >= 2 && setShowSuggestions(true)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${themeClasses.input}`}
      />
      
      {/* Portal pour les suggestions */}
      {showSuggestions && value.length >= 2 &&
        createPortal(
          <div 
            ref={suggestionsRef}
            className={`fixed z-[3000] w-full mt-1 border rounded-lg max-h-60 overflow-y-auto ${themeClasses.dropdown}`}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            {isLoading ? (
              <div className={`px-4 py-3 ${themeClasses.loadingText}`}>
                Chargement...
              </div>
            ) : suggestions.length === 0 ? (
              <div className={`px-4 py-3 ${themeClasses.loadingText}`}>
                Aucun résultat
              </div>
            ) : (
              suggestions.map((commune, idx) => (
                <button
                  key={`${commune.nom}-${idx}`}
                  onClick={() => handleSelectCity(commune)}
                  className={`w-full px-4 py-3 text-left transition-colors ${themeClasses.dropdownItem}`}
                >
                  {commune.nom}
                  {commune.codesPostaux?.[0] && (
                    <span className={`text-sm ml-2 ${themeClasses.postalCode}`}>
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
  );
}