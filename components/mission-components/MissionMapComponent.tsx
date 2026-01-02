
import { Mission, missionsData } from "@/app/data/missions";
import { Calendar, MapPin, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import cityCoordinates from "@/app/data/cityCoordinates";

export default function MissionMapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(missionsData[0]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Charger Leaflet
    const loadLeaflet = async () => {
      const L = (window as any).L;
      if (!L && !document.getElementById('leaflet-css')) {
        // Ajouter le CSS
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Ajouter le JS
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

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Initialiser la carte
    const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMapLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedMission || !isMapLoaded) return;

    const L = (window as any).L;
    const map = mapInstanceRef.current;

    // Nettoyer les anciens marqueurs et lignes
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const startCoords = cityCoordinates[selectedMission.villeDepart];
    const endCoords = cityCoordinates[selectedMission.villeArrivee];

    if (startCoords && endCoords) {
      // Marqueur de départ (vert)
      const startIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #10b981; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">D</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker(startCoords, { icon: startIcon })
        .bindPopup(`<b>Départ: ${selectedMission.villeDepart}</b><br>${selectedMission.lieuDepart}`)
        .addTo(map);

      // Marqueur d'arrivée (rouge)
      const endIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">A</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker(endCoords, { icon: endIcon })
        .bindPopup(`<b>Arrivée: ${selectedMission.villeArrivee}</b><br>${selectedMission.lieuArrivee}`)
        .addTo(map);

      // 🚗 Récupérer le trajet réel via OSRM (OpenStreetMap Routing Machine)
      const getRoute = async () => {
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
          
          const response = await fetch(url);
          const data = await response.json();

          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates;

            // Convertir les coordonnées [lon, lat] en [lat, lon] pour Leaflet
            const leafletCoords = coordinates.map((coord: number[]) => [coord[1], coord[0]]);

            // Tracer le trajet réel sur les routes
            const polyline = L.polyline(leafletCoords, {
              color: '#3b82f6',
              weight: 5,
              opacity: 0.8,
              lineJoin: 'round',
              lineCap: 'round'
            }).addTo(map);

            // Ajuster la vue pour montrer tout le trajet
            map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

            // Ajouter un popup avec les informations du trajet
            const distance = (route.distance / 1000).toFixed(1); // en km
            const duration = Math.round(route.duration / 60); // en minutes

            polyline.bindPopup(`
              <div style="font-family: system-ui;">
                <b>📍 Itinéraire</b><br>
                <span style="color: #64748b;">Distance: ${distance} km</span><br>
                <span style="color: #64748b;">Durée estimée: ${duration} min</span>
              </div>
            `);

          } else {
            console.warn('Aucun itinéraire trouvé, tracé direct');
            // Fallback: ligne droite si pas de route trouvée
            L.polyline([startCoords, endCoords], {
              color: '#3b82f6',
              weight: 4,
              opacity: 0.7,
              dashArray: '10, 10'
            }).addTo(map);

            const bounds = L.latLngBounds([startCoords, endCoords]);
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        } catch (error) {
          console.error('Erreur lors du calcul de l\'itinéraire:', error);
          // Fallback: ligne droite en cas d'erreur
          L.polyline([startCoords, endCoords], {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10'
          }).addTo(map);

          const bounds = L.latLngBounds([startCoords, endCoords]);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      };

      getRoute();
    }
  }, [selectedMission, isMapLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-10xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Carte des Trajets de Missions
          </h1>
          <p className="text-slate-600">
            Visualisez les itinéraires entre les villes de départ et d'arrivée
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Liste des missions */}
          

          {/* Carte */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Informations de la mission sélectionnée */}
              {selectedMission && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
                  <h2 className="text-xl font-bold mb-2">
                    {selectedMission.villeDepart} → {selectedMission.villeArrivee}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="opacity-90">Départ:</div>
                      <div className="font-semibold">{selectedMission.lieuDepart}</div>
                      <div className="text-xs opacity-75">{selectedMission.adresseDepartComplete}</div>
                    </div>
                    <div>
                      <div className="opacity-90">Arrivée:</div>
                      <div className="font-semibold">{selectedMission.lieuArrivee}</div>
                      <div className="text-xs opacity-75">{selectedMission.adresseArriveeComplete}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-4 text-sm">
                    <div className="bg-white/20 rounded px-3 py-1">
                      <span className="opacity-90">Distance: </span>
                      <span className="font-semibold">{selectedMission.nbKm} km</span>
                    </div>
                    <div className="bg-white/20 rounded px-3 py-1">
                      <span className="opacity-90">Entité: </span>
                      <span className="font-semibold">{selectedMission.entite}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Carte Leaflet */}
              <div 
                ref={mapRef} 
                className="w-full h-[500px] bg-slate-100"
              >
                {!isMapLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                      <p className="text-slate-600">Chargement de la carte...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

