// components/mission-components/DynamicMissionsMap.tsx
import { useState, useEffect, useRef } from 'react';
import { Navigation, AlertCircle, RefreshCw } from 'lucide-react';
import { MissionDetail } from '@/app/types/mission';

interface RouteStats {
  distance: string | number;
  duration: number | null;
}

type Coordinates = [number, number];

interface RouteData {
  coordinates: Coordinates[];
  distance: string | null;
  duration: number | null;
  isDirect?: boolean;
}

interface DynamicMissionsMapProps {
  mission: MissionDetail; // ✅ Type mis à jour
  onDurationCalculated?: (duration: number) => void;
}

export default function DynamicMissionsMap({ 
  mission,
  onDurationCalculated
}: DynamicMissionsMapProps) {

  if (!mission) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">Mission non trouvée</p>
        </div>
      </div>
    );
  }

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routeLayersRef = useRef<any[]>([]);
  const geocodeCache = useRef<Record<string, Coordinates>>({});
  
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [routeStats, setRouteStats] = useState<RouteStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Utiliser les coordonnées GPS si disponibles, sinon geocoder
  const getCoordinates = async (
    ville: string, 
    latitude?: number, 
    longitude?: number
  ): Promise<Coordinates | null> => {
    // Si on a déjà les coordonnées GPS
    if (latitude && longitude) {
      return [latitude, longitude];
    }
    
    // Sinon, geocoder la ville
    return geocodeCity(ville);
  };

  // Geocoding function
  const geocodeCity = async (cityName: string): Promise<Coordinates | null> => {
    if (geocodeCache.current[cityName]) {
      return geocodeCache.current[cityName];
    }

    try {
      const query = `${cityName}, France`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MissionMapApp/1.0'
        }
      });
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const coords: Coordinates = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        geocodeCache.current[cityName] = coords;
        return coords;
      }
      
      throw new Error(`Ville non trouvée: ${cityName}`);
    } catch (error) {
      console.error(`Erreur géocodage pour ${cityName}:`, error);
      return null;
    }
  };

  // Load Leaflet
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLeaflet = async () => {
      const L = (window as any).L;
      if (!L && !document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => setIsMapLoaded(true);
        document.body.appendChild(script);
      } else if (L) {
        setIsMapLoaded(true);
      }
    };

    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMapLoaded]);

  // Fetch route from OSRM
  const fetchRoute = async (
    startCoords: Coordinates, 
    endCoords: Coordinates
  ): Promise<RouteData> => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const durationMinutes = Math.round(route.duration / 60);
        
        if (onDurationCalculated) {
          onDurationCalculated(durationMinutes);
        }
        
        return {
          coordinates: route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as Coordinates),
          distance: (route.distance / 1000).toFixed(1),
          duration: durationMinutes
        };
      }
    } catch (error) {
      console.error('Erreur OSRM:', error);
    }

    return {
      coordinates: [startCoords, endCoords],
      distance: null,
      duration: null,
      isDirect: true
    };
  };

  // Load route when mission changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded || !mission) return;

    const L = (window as any).L;
    const map = mapInstanceRef.current;

    routeLayersRef.current.forEach(layer => map.removeLayer(layer));
    routeLayersRef.current = [];

    const loadRoute = async () => {
      setLoading(true);
      setError(null);

      // ✅ Utiliser les coordonnées GPS de la base de données
      const startCoords = await getCoordinates(
        mission.adresseDepart.villeNom,
        mission.adresseDepart.latitude,
        mission.adresseDepart.longitude
      );
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const endCoords = await getCoordinates(
        mission.adresseArrivee.villeNom,
        mission.adresseArrivee.latitude,
        mission.adresseArrivee.longitude
      );

      if (!startCoords || !endCoords) {
        setError(`Impossible de localiser ${!startCoords ? mission.adresseDepart.villeNom : mission.adresseArrivee.villeNom}`);
        setLoading(false);
        return;
      }

      const routeData = await fetchRoute(startCoords, endCoords);
      
      setRouteStats({
        distance: routeData.distance || mission.calculs?.distanceKm || 0,
        duration: routeData.duration
      });

      const layers: any[] = [];
      const color = '#f97316'; // Orange

      // Start marker
      const startIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); font-size: 16px;">D</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const startMarker = L.marker(startCoords, { icon: startIcon })
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 240px;">
            <b style="color: ${color}; font-size: 16px;">🚀 Départ</b><br>
            <div style="margin-top: 8px;">
              <div style="font-weight: 600; color: #1e293b; font-size: 14px;">${mission.adresseDepart.villeNom}</div>
              <div style="color: #64748b; font-size: 12px; margin-top: 4px;">${mission.adresseDepart.adresseComplete}</div>
              ${mission.adresseDepart.nomLieu ? `<div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">📍 ${mission.adresseDepart.nomLieu}</div>` : ''}
            </div>
          </div>
        `)
        .addTo(map);

      // End marker
      const endIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #10b981; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); font-size: 16px;">A</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const endMarker = L.marker(endCoords, { icon: endIcon })
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 240px;">
            <b style="color: #10b981; font-size: 16px;">🎯 Arrivée</b><br>
            <div style="margin-top: 8px;">
              <div style="font-weight: 600; color: #1e293b; font-size: 14px;">${mission.adresseArrivee.villeNom}</div>
              <div style="color: #64748b; font-size: 12px; margin-top: 4px;">${mission.adresseArrivee.adresseComplete}</div>
              ${mission.adresseArrivee.nomLieu ? `<div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">📍 ${mission.adresseArrivee.nomLieu}</div>` : ''}
            </div>
          </div>
        `)
        .addTo(map);

      // Route polyline
      const polyline = L.polyline(routeData.coordinates, {
        color: color,
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round',
        lineCap: 'round',
        dashArray: routeData.isDirect ? '10, 10' : undefined
      }).bindPopup(`
        <div style="font-family: system-ui;">
          <b style="color: ${color}; font-size: 14px;">📍 ${mission.adresseDepart.villeNom} → ${mission.adresseArrivee.villeNom}</b><br>
          <div style="margin-top: 8px; color: #64748b; font-size: 13px;">
            ${routeData.distance ? `🛣️ Distance: <b style="color: #0f172a;">${routeData.distance} km</b><br>` : ''}
            ${routeData.duration ? `⏱️ Durée estimée: <b style="color: #0f172a;">${Math.floor(routeData.duration / 60)}h ${routeData.duration % 60}min</b><br>` : ''}
            ${routeData.isDirect ? '⚠️ Trajet direct (estimation)' : '✅ Itinéraire routier réel'}
          </div>
        </div>
      `).addTo(map);

      layers.push(startMarker, endMarker, polyline);
      routeLayersRef.current = layers;

      const bounds = L.latLngBounds([startCoords, endCoords]);
      map.fitBounds(bounds, { padding: [60, 60] });

      setLoading(false);
    };

    loadRoute();
  }, [isMapLoaded, mission, onDurationCalculated]);

  return (
    <div className="w-full h-full">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-900">Erreur de géocodage</div>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {routeStats && (
        <div className="mb-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Navigation className="w-6 h-6 text-orange-600" />
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-900">
                {mission.adresseDepart.villeNom} → {mission.adresseArrivee.villeNom}
              </div>
              <div className="text-xs text-gray-700 mt-1 flex items-center gap-3">
                <span>
                  📏 Distance: <span className="font-semibold text-orange-700">{routeStats.distance} km</span>
                </span>
                {routeStats.duration && (
                  <span>
                    ⏱️ Durée: <span className="font-semibold text-orange-700">{Math.floor(routeStats.duration / 60)}h {routeStats.duration % 60}min</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-orange-200">
        <div 
          ref={mapRef} 
          className="w-full h-[500px] bg-slate-100 relative"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-[1000]">
              <div className="text-center">
                <RefreshCw className="w-10 h-10 text-orange-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-800 font-semibold text-lg">Chargement de l'itinéraire...</p>
                <p className="text-gray-600 text-sm mt-2">
                  Calcul du trajet en cours
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
