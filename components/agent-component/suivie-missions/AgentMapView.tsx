"use client";
import { useState, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import AgentMapMarkers from "./AgentMapMarkers";
import { getMarkerStatus } from "@/app/types/map-agent";
import { useActiveMissionsMap } from "@/app/hooks/useActiveMissionsMap";

// Minicontrôle refresh + stats flottant sur la carte
function MapOverlay({
  total,
  deviated,
  gpsOld,
  loading,
  onRefresh,
}: {
  total: number;
  deviated: number;
  gpsOld: number;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <>
      {/* Stats — haut gauche */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <div className="bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl">
          <span className="w-2 h-2 bg-orange-500 rounded-full" />
          <span className="text-xs font-bold text-white">{total}</span>
          <span className="text-xs text-zinc-400">missions</span>
        </div>
        {deviated > 0 && (
          <div className="bg-red-950/95 backdrop-blur border border-red-800 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl animate-pulse">
            <span className="w-2 h-2 bg-red-400 rounded-full" />
            <span className="text-xs font-bold text-red-300">{deviated} déviation{deviated > 1 ? "s" : ""}</span>
          </div>
        )}
        {gpsOld > 0 && (
          <div className="bg-orange-950/95 backdrop-blur border border-orange-800 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl">
            <span className="w-2 h-2 bg-orange-400 rounded-full" />
            <span className="text-xs font-bold text-orange-300">{gpsOld} GPS ancien{gpsOld > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Refresh — haut droite */}
      <button
        onClick={onRefresh}
        disabled={loading}
        className="absolute top-4 right-4 z-[1000] bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-zinc-300 hover:text-white hover:border-orange-600 transition-all shadow-xl disabled:opacity-50"
      >
        <svg
          className={`w-3.5 h-3.5 ${loading ? "animate-spin text-orange-400" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualiser
      </button>

      {/* Légende — bas gauche */}
      <div className="absolute bottom-8 left-4 z-[1000] bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-xl px-3 py-2.5 shadow-xl">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Légende</p>
        <div className="space-y-1">
          {[
            { color: "bg-green-400", label: "GPS normal" },
            { color: "bg-orange-400", label: "GPS ancien (> 10 min)" },
            { color: "bg-red-400",    label: "Déviation GPS" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
              <span className="text-[11px] text-zinc-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function AgentMapView() {
  const { missions, loading, error, refetch } = useActiveMissionsMap(15000);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fix icônes Leaflet Next.js
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

  const counts = useMemo(() => ({
    deviated: missions.filter((m) => getMarkerStatus(m) === "deviated").length,
    gpsOld:   missions.filter((m) => getMarkerStatus(m) === "gps_old").length,
  }), [missions]);

  // Centre initial : Tunisie
  const center: [number, number] = [33.8869, 9.5375];

  return (
    <div className="relative w-full h-full">
      {/* Erreur */}
      {error && (
        <div className="absolute top-0 left-0 right-0 z-[2000] bg-red-950/90 border-b border-red-800 px-4 py-2 flex items-center gap-2 text-xs text-red-300">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
          {error}
          <button onClick={refetch} className="ml-auto underline hover:text-white">
            Réessayer
          </button>
        </div>
      )}

      {/* Overlays flottants */}
      <MapOverlay
        total={missions.length}
        deviated={counts.deviated}
        gpsOld={counts.gpsOld}
        loading={loading}
        onRefresh={refetch}
      />

      {/* Carte */}
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
        zoomControl={false}
      >
        {/* Tuile CartoDB dark — cohérent avec le thème noir/orange */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Markers colorés avec popup */}
        <AgentMapMarkers
          missions={missions}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </MapContainer>

      {/* Empty state */}
      {!loading && missions.length === 0 && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[500]">
          <div className="bg-zinc-900/90 border border-zinc-700 rounded-2xl px-8 py-6 text-center">
            <p className="text-2xl mb-2">🗺️</p>
            <p className="text-sm font-semibold text-white mb-1">Aucune mission en cours</p>
            <p className="text-xs text-zinc-500">Les missions actives apparaîtront ici.</p>
          </div>
        </div>
      )}
    </div>
  );
}