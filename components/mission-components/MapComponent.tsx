// components/mission-components/MapComponent.tsx
"use client";

import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix des icônes Leaflet en Next.js
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icône verte pour le point d'arrivée
const arrivalIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapPoint {
  position: [number, number]; // [lat, lon]
  radius: number; // en mètres
  color?: string; // couleur du cercle
  label?: string; // optionnel: "départ" ou "arrivée"
}

interface MapComponentProps {
  center?: [number, number];
  radius?: number;
  zoom?: number;
  points?: any[];
}

// Composant pour gérer le changement de centre avec animation
function MapViewController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      // Utilise flyTo pour une transition fluide
      map.flyTo(center, zoom || 13, {
        duration: 1.5, // Durée de l'animation en secondes
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);

  return null;
}

// Composant pour ajuster automatiquement la vue de la carte
function MapBoundsAdjuster({ points }: { points: MapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 1) {
      const bounds = points.map(p => p.position);
      map.fitBounds(bounds, { 
        padding: [50, 50],
        duration: 1.5 // Animation fluide
      });
    }
  }, [map, points]);

  return null;
}

export default function MapComponent({ center, radius, points, zoom }: MapComponentProps) {
  useEffect(() => {
    // Nécessaire pour que les icônes s'affichent correctement
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        delete (L as any).Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      });
    }
  }, []);

  // Convertir l'ancien format en nouveau format pour la rétrocompatibilité
  const mapPoints: MapPoint[] = points || (center && radius ? [{
    position: center,
    radius: radius,
    color: "#f97316"
  }] : []);

  // Calculer le centre initial de la carte
  const initialCenter: [number, number] = center || [46.603354, 1.888334]; // Centre de la France par défaut
  const initialZoom = zoom || (center ? 11 : 6);

  return (
    <MapContainer 
      center={initialCenter} 
      zoom={initialZoom} 
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Contrôleur pour animer le changement de centre */}
      <MapViewController center={center} zoom={zoom} />
      
      {/* Ajuster la vue si plusieurs points */}
      {mapPoints.length > 1 && <MapBoundsAdjuster points={mapPoints} />}
      
      {/* Afficher tous les points */}
      {mapPoints.map((point, index) => {
        const color = point.color || "#f97316";
        const icon = point.label === "arrivée" ? arrivalIcon : customIcon;
        
        return (
          <div key={index}>
            <Marker position={point.position} icon={icon} />
            <Circle
              center={point.position}
              radius={point.radius}
              pathOptions={{ 
                color: color, 
                fillColor: color, 
                fillOpacity: 0.2 
              }}
            />
          </div>
        );
      })}
    </MapContainer>
  );
}