import { Mission } from "./mission";

// types/search.ts
export type SearchMode = 'nearby' | 'route';

export interface SearchState {
  mode: SearchMode;
  keyword: string;
  
  // Mode "Autour de moi"
  userPosition: { lat: number; lng: number } | null;
  radius: number; // en km
  
  // Mode "Trajet"
  departCity: string;
  arrivalCity: string;
  
  // Résultats
  results: Mission[];
  isSearching: boolean;
}

export const initialSearchState: SearchState = {
  mode: 'nearby',
  keyword: '',
  userPosition: null,
  radius: 10,
  departCity: '',
  arrivalCity: '',
  results: [],
  isSearching: false
};