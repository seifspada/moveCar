"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useActiveMissionsMap } from "@/app/hooks/useActiveMissionsMap";
import { GET_MISSION_TRACKING_HISTORY } from "@/lib/graphql/queries/map-agent";
import { getMarkerStatus, GPSTrack } from "@/app/types/map-agent";
import { useApolloClient } from "@apollo/client/react";
import AgentMapMarkers from "./AgentMapMarkers";
import RatingPanel, { MissionWithEval } from "./RatingPanal";

export default function AgentMapView() {
  const { missions, loading, error, refetch } = useActiveMissionsMap(15000);
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [ratingMission, setRatingMission] = useState<MissionWithEval | null>(null);
  const [trackHistory, setTrackHistory] = useState<Record<string, GPSTrack[]>>({});
  const client = useApolloClient();

  // Fix icônes Leaflet Next.js
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  // Charge l'historique GPS quand on sélectionne une mission
  const loadHistory = useCallback(async (missionId: string) => {
    if (trackHistory[missionId]) return;
    try {
      const { data } = await client.query<{ getMissionTrackingHistory: GPSTrack[] }>({
        query: GET_MISSION_TRACKING_HISTORY,
        variables: { missionId },
        fetchPolicy: "network-only",
      });
      if (data?.getMissionTrackingHistory) {
        setTrackHistory((prev) => ({ ...prev, [missionId]: data.getMissionTrackingHistory }));
      }
    } catch (error) {
      console.error("Erreur chargement historique:", error);
    }
  }, [client, trackHistory]);

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) loadHistory(id);
  }, [loadHistory]);

  // Ouvre le panneau de notation pour une mission TERMINEE
  const handleOpenRating = useCallback((mission: MissionWithEval) => {
    setRatingMission(mission);
  }, []);

  const handleCloseRating = useCallback(() => {
    setRatingMission(null);
  }, []);

  // Points de route extraits depuis les missions
  const routePoints = useMemo(() => {
    const map: Record<string, {
      departure?: [number, number];
      destination?: [number, number]
    }> = {};
    missions.forEach((m) => {
      const destination =
        typeof m.latitudeArrivee === "number" && typeof m.longitudeArrivee === "number"
          ? ([m.latitudeArrivee, m.longitudeArrivee] as [number, number])
          : undefined;
      const departure =
        typeof m.latitudeDepart === "number" && typeof m.longitudeDepart === "number"
          ? ([m.latitudeDepart, m.longitudeDepart] as [number, number])
          : undefined;
      if (destination || departure) map[m.missionId] = { destination, departure };
    });
    return map;
  }, [missions]);

  const counts = useMemo(() => ({
    deviated: missions.filter((m) => getMarkerStatus(m) === "deviated").length,
    gpsOld:   missions.filter((m) => getMarkerStatus(m) === "gps_old").length,
    terminee: missions.filter((m) => (m as MissionWithEval).statut === "TERMINEE").length,
  }), [missions]);

  const center: [number, number] = [33.8869, 9.5375];

  return (
    <div className="relative w-full h-full">
      {error && (
        <div className="absolute top-0 inset-x-0 z-[2000] bg-red-950/90 border-b border-red-800 px-4 py-2 flex items-center gap-2 text-xs text-red-300">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
          {error}
          <button onClick={refetch} className="ml-auto underline hover:text-white">Réessayer</button>
        </div>
      )}

      {/* Stats flottantes */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2 flex-wrap">
        <Chip color="orange" label={`${missions.length} missions`} />
        {counts.deviated > 0 && (
          <Chip color="red" label={`${counts.deviated} déviation${counts.deviated > 1 ? "s" : ""}`} pulse />
        )}
        {counts.gpsOld > 0 && (
          <Chip color="orange" label={`${counts.gpsOld} GPS ancien${counts.gpsOld > 1 ? "s" : ""}`} />
        )}
        {counts.terminee > 0 && (
          <Chip color="green" label={`${counts.terminee} à évaluer`} />
        )}
      </div>

      {/* Légende */}
      <div className="absolute bottom-8 left-4 z-[1000] bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-xl px-3 py-2.5 shadow-xl space-y-1.5">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Légende</p>
        <LegendItem dot="bg-green-400"  label="GPS normal" />
        <LegendItem dot="bg-orange-400" label="GPS ancien (> 10 min)" />
        <LegendItem dot="bg-red-400"    label="Déviation GPS" />
        <LegendItem dot="bg-purple-400" label="Mission terminée" />
        <div className="border-t border-zinc-700 pt-1.5 space-y-1">
          <LegendLine color="bg-orange-600" label="Trajet complet" opacity="opacity-30" />
          <LegendLine color="bg-blue-400"   label="Trajet parcouru" />
          <LegendLine color="bg-orange-400" label="Position → arrivée" dashed />
        </div>
      </div>

      {/* Refresh */}
      <button
        onClick={refetch}
        disabled={loading}
        className="absolute top-4 right-4 z-[1000] bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-zinc-300 hover:text-white hover:border-orange-600 transition-all shadow-xl disabled:opacity-50"
      >
        <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin text-orange-400" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Actualiser
      </button>

      <MapContainer
        center={center}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />
        <AgentMapMarkers
          missions={missions as MissionWithEval[]}
          selectedId={selectedId}
          onSelect={handleSelect}
          onOpenRating={handleOpenRating}
          trackHistory={trackHistory}
          routePoints={routePoints}
        />
      </MapContainer>

      {/* Panneau flottant d'évaluation */}
      {ratingMission && (
        <RatingPanel
          mission={ratingMission}
          onClose={handleCloseRating}
        />
      )}

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

// ── Petits composants UI ─────────────────────────────────────

function Chip({ color, label, pulse }: { color: "orange" | "red" | "green"; label: string; pulse?: boolean }) {
  const styles = {
    red:    "bg-red-950/95 border-red-800 text-red-300",
    orange: "bg-zinc-900/95 border-zinc-700 text-white",
    green:  "bg-purple-950/95 border-purple-800 text-purple-300",
  };
  const dotStyles = {
    red:    "bg-red-400",
    orange: "bg-orange-500",
    green:  "bg-purple-400",
  };
  return (
    <div className={`backdrop-blur border rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl text-xs font-bold ${styles[color]} ${pulse ? "animate-pulse" : ""}`}>
      <span className={`w-2 h-2 rounded-full ${dotStyles[color]}`} />
      {label}
    </div>
  );
}

function LegendItem({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
      <span className="text-[11px] text-zinc-300">{label}</span>
    </div>
  );
}

function LegendLine({ color, label, dashed, opacity }: { color: string; label: string; dashed?: boolean; opacity?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-5 h-0.5 flex-shrink-0 rounded ${color} ${opacity || ""}`}
        style={dashed ? { backgroundImage: "none", borderTop: "2px dashed #ea580c", height: 0 } : {}}
      />
      <span className="text-[11px] text-zinc-300">{label}</span>
    </div>
  );
}