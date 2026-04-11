// components/mission-components/MapComponent.tsx
"use client";

import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const arrivalIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapPoint {
  position: [number, number];
  radius: number;
  color?: string;
  label?: string;
}

interface MapComponentProps {
  center?: [number, number];
  radius?: number;
  zoom?: number;
  points?: any[];
}

function MapViewController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom ?? map.getZoom(), {
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);

  return null;
}

function MapBoundsAdjuster({ points }: { points: MapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 1) {
      const bounds = points.map((p) => p.position);
      map.fitBounds(bounds, {
        padding: [50, 50],
        duration: 0.8,
      });
    }
  }, [map, points]);

  return null;
}

export default function MapComponent({ center, radius, points, zoom }: MapComponentProps) {
  useEffect(() => {
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

  const mapPoints: MapPoint[] =
    points ||
    (center && radius
      ? [
          {
            position: center,
            radius: radius,
            color: "#f97316",
          },
        ]
      : []);

  const initialCenter: [number, number] = center || [46.603354, 1.888334];
  const initialZoom = zoom ?? 5;

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

      <MapViewController center={center} zoom={zoom} />

      {mapPoints.length > 1 && <MapBoundsAdjuster points={mapPoints} />}

      {mapPoints.map((point, index) => {
        const color = point.color || "#f97316";
        const icon = point.label === "arrivée" ? arrivalIcon : customIcon;

        return (
          <div key={`${point.position[0]}-${point.position[1]}-${point.radius}-${index}`}>
            <Marker position={point.position} icon={icon} />
            <Circle
              key={`circle-${point.position[0]}-${point.position[1]}-${point.radius}`}
              center={point.position}
              radius={point.radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.15,
                weight: 1.5,
              }}
            />
          </div>
        );
      })}
    </MapContainer>
  );
}
