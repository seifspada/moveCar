import { useState, useEffect, useRef } from 'react';
import { Navigation, AlertCircle, RefreshCw } from 'lucide-react';
import { Mission as MissionType } from '@/app/data/missions'; // Import your actual Mission type


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
  mission?: MissionType; // Utiliser le type importé
  missionId?: number;
  missionsData?: MissionType[]; // Utiliser le type importé
  onBack?: () => void;
  onReserve?: () => void;
}

export default function DynamicMissionsMap({ 
  mission: missionProp, 
  missionId, 
  missionsData: missionsDataProp, 
  onBack, 
  onReserve 
}: DynamicMissionsMapProps) {

  const mission = missionProp || (missionId && missionsDataProp ? missionsDataProp.find(m => m.id === missionId) : null);
  
  if (!mission) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">Mission non trouvée</p>
          <p className="text-slate-500 text-sm mt-1">Veuillez fournir une mission valide</p>
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

 // Geocoding function - utilise uniquement les noms de villes
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
        return {
          coordinates: route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as Coordinates),
          distance: (route.distance / 1000).toFixed(1),
          duration: Math.round(route.duration / 60)
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

    // Clear existing layers
    routeLayersRef.current.forEach(layer => map.removeLayer(layer));
    routeLayersRef.current = [];

    const loadRoute = async () => {
      setLoading(true);
      setError(null);

      const startCoords = await geocodeCity(
        mission.villeDepart, 
      );
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const endCoords = await geocodeCity(
        mission.villeArrivee, 
      );

      if (!startCoords || !endCoords) {
        setError(`Impossible de localiser ${!startCoords ? mission.villeDepart : mission.villeArrivee}`);
        setLoading(false);
        return;
      }

      const routeData = await fetchRoute(startCoords, endCoords);
      
      setRouteStats({
        distance: routeData.distance || mission.nbKm,
        duration: routeData.duration
      });

      const layers: any[] = [];
      const color = '#3b82f6';

      // Start marker
      const startIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); font-size: 14px;">D</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const startMarker = L.marker(startCoords, { icon: startIcon })
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 220px;">
            <b style="color: ${color}; font-size: 15px;">🚀 Départ</b><br>
            <div style="margin-top: 8px;">
              <div style="font-weight: 600; color: #1e293b;">${mission.villeDepart}</div>
              ${mission.adresseDepartComplete ? `<div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">${mission.adresseDepartComplete}</div>` : ''}
            </div>
          </div>
        `)
        .addTo(map);

      // End marker
      const endIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); font-size: 14px;">A</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const endMarker = L.marker(endCoords, { icon: endIcon })
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 220px;">
            <b style="color: ${color}; font-size: 15px;">🎯 Arrivée</b><br>
            <div style="margin-top: 8px;">
              <div style="font-weight: 600; color: #1e293b;">${mission.villeArrivee}</div>
              ${mission.adresseArriveeComplete ? `<div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">${mission.adresseArriveeComplete}</div>` : ''}
            </div>
          </div>
        `)
        .addTo(map);

      // Route polyline
      const polyline = L.polyline(routeData.coordinates, {
        color: color,
        weight: 5,
        opacity: 0.7,
        lineJoin: 'round',
        lineCap: 'round',
        dashArray: routeData.isDirect ? '10, 10' : undefined
      }).bindPopup(`
        <div style="font-family: system-ui;">
          <b style="color: ${color}; font-size: 14px;">📍 ${mission.villeDepart} → ${mission.villeArrivee}</b><br>
          <div style="margin-top: 8px; color: #64748b; font-size: 13px;">
            ${routeData.distance ? `🛣️ Distance: <b>${routeData.distance} km</b><br>` : ''}
            ${routeData.duration ? `⏱️ Durée: <b>${routeData.duration} min</b><br>` : ''}
            ${routeData.isDirect ? '⚠️ Trajet direct (estimation)<br>' : '✅ Itinéraire routier réel<br>'}
          </div>
        </div>
      `).addTo(map);

      layers.push(startMarker, endMarker, polyline);
      routeLayersRef.current = layers;

      // Fit map to bounds
      const bounds = L.latLngBounds([startCoords, endCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });

      setLoading(false);
    };

    loadRoute();
  }, [isMapLoaded, mission]);

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
        <div className="mb-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {mission.villeDepart} → {mission.villeArrivee}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Distance: <span className="font-semibold text-orange-600">{routeStats.distance} km</span>
                  {routeStats.duration && (
                    <> • Durée: <span className="font-semibold">{routeStats.duration} min</span></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-[500px] bg-slate-100 relative"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-[1000]">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-orange-600 animate-spin mx-auto mb-3" />
                <p className="text-slate-600 font-semibold">Chargement du trajet...</p>
                <p className="text-slate-500 text-sm mt-1">
                  Calcul de l'itinéraire en cours
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}