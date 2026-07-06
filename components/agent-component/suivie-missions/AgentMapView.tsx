// components/agent-component/suivie-missions/AgentMapView.tsx
"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useActiveMissionsMap } from "@/app/hooks/useActiveMissionsMap";
import { useMissionCurrentLocation } from "@/app/hooks/useMissionCurrentLocation";
import { GET_MISSION_TRACKING_HISTORY, UPDATE_MISSION_LOCATION } from "@/lib/graphql/queries/map-agent";
import { getMarkerStatus, formatLastSeen, GPSTrack } from "@/app/types/map-agent";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { Gauge } from "lucide-react";
import AgentMapMarkers from "./AgentMapMarkers";
import RatingPanel, { MissionWithEval } from "./RatingPanal";

type UpdateMissionLocationPayload = {
  updateMissionLocation: {
    id: string;
    latitude: number;
    longitude: number;
    speed: number | null;
    timestamp: string;
    isDeviated: boolean;
  };
};

type UpdateMissionLocationVariables = {
  input: {
    missionId: string;
    latitude: number;
    longitude: number;
    accuracy: number | null;
    speed: number | null;
    timestamp: string;
  };
};

export default function AgentMapView() {
  const { missions, loading, error, refetch } = useActiveMissionsMap(15000);
  const [selectedId, setSelectedId]       = useState<string | null>(null);
  const [ratingMission, setRatingMission] = useState<MissionWithEval | null>(null);
  const [trackHistory, setTrackHistory]   = useState<Record<string, GPSTrack[]>>({});
  const [currentSpeed, setCurrentSpeed]   = useState<number | null>(null);
  const [gpsLastUpdate, setGpsLastUpdate] = useState<string | null>(null);
  const [gpsStatus, setGpsStatus]         = useState<"idle" | "active" | "unavailable" | "error">("idle");
  const client = useApolloClient();
  const [updateMissionLocation] = useMutation<UpdateMissionLocationPayload, UpdateMissionLocationVariables>(
    UPDATE_MISSION_LOCATION
  );

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

  // Chargement initial du tracé complet — une seule fois par mission sélectionnée
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
    } catch (err) {
      console.error("Erreur chargement historique:", err);
    }
  }, [client, trackHistory]);

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) loadHistory(id);
  }, [loadHistory]);

  const handleOpenRating  = useCallback((mission: MissionWithEval) => setRatingMission(mission), []);
  const handleCloseRating = useCallback(() => setRatingMission(null), []);

  const gpsMission = useMemo(() => {
    if (selectedId) return missions.find((m) => m.missionId === selectedId) ?? null;
    return missions.length === 1 ? missions[0] : null;
  }, [missions, selectedId]);

  const gpsMissionId = gpsMission?.missionId ?? null;

  // Charge le tracé complet dès qu'une mission unique est auto-sélectionnée
  // (le cas "sélection manuelle" est déjà couvert par handleSelect)
  useEffect(() => {
    if (gpsMissionId) loadHistory(gpsMissionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpsMissionId]);

  // Position actuelle temps réel — remplace l'ancien polling complet de l'historique (1s)
  // par une requête légère qui ne renvoie que le dernier point GPS
  const { location: currentLocation } = useMissionCurrentLocation(gpsMissionId ?? "", {
    pollInterval: 3000,
    skip: !gpsMissionId,
  });

  // Injecte le nouveau point dans trackHistory pour prolonger le tracé sur la carte
  useEffect(() => {
    if (!gpsMissionId || !currentLocation) return;

    setTrackHistory((prev) => {
      const existing = prev[gpsMissionId] ?? [];
      if (existing.some((point) => point.id === currentLocation.id)) return prev;

      const nextPoint: GPSTrack = {
        id: currentLocation.id,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        timestamp: currentLocation.timestamp,
        speed: currentLocation.speed,
        accuracy: currentLocation.accuracy,
        isDeviated: currentLocation.isDeviated,
        sessionId: null,
        distanceFromRoute: null,
      };

      return { ...prev, [gpsMissionId]: [...existing, nextPoint] };
    });
  }, [gpsMissionId, currentLocation]);

  // Dérive vitesse / dernière position affichées dans le panneau flottant
  useEffect(() => {
    if (!gpsMissionId) {
      setCurrentSpeed(null);
      setGpsLastUpdate(null);
      setGpsStatus("idle");
      return;
    }

    const history = trackHistory[gpsMissionId];
    const last = history?.[history.length - 1];
    setCurrentSpeed(last?.speed ?? null);
    setGpsLastUpdate(last?.timestamp ?? null);
  }, [gpsMissionId, trackHistory]);

  // Envoi de la position du convoyeur/agent en conduite (mutation, flux distinct de la lecture)
  useEffect(() => {
    if (!gpsMissionId) return;

    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsStatus("unavailable");
      return;
    }

    let cancelled = false;
    setGpsStatus("active");

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const nativeSpeed = position.coords.speed;
        const speedKmh =
          typeof nativeSpeed === "number" && Number.isFinite(nativeSpeed)
            ? nativeSpeed * 3.6
            : null;
        const timestamp = new Date(position.timestamp || Date.now()).toISOString();

        try {
          const { data } = await updateMissionLocation({
            variables: {
              input: {
                missionId: gpsMissionId,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy ?? null,
                speed: speedKmh,
                timestamp,
              },
            },
          });

          const updatedPoint = data?.updateMissionLocation;
          if (!cancelled && updatedPoint) {
            setCurrentSpeed(updatedPoint.speed ?? null);
            setGpsLastUpdate(updatedPoint.timestamp);
            setGpsStatus("active");
            setTrackHistory((prev) => {
              const existing = prev[gpsMissionId] ?? [];
              const nextPoint: GPSTrack = {
                ...updatedPoint,
                accuracy: position.coords.accuracy ?? null,
                sessionId: null,
                distanceFromRoute: null,
              };
              return {
                ...prev,
                [gpsMissionId]: [
                  ...existing.filter((point) => point.id !== updatedPoint.id),
                  nextPoint,
                ],
              };
            });
          }
        } catch (err) {
          console.error("Erreur updateMissionLocation:", err);
        }
      },
      (err) => {
        console.error("Erreur geolocalisation:", err);
        if (!cancelled) setGpsStatus("error");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );

    return () => {
      cancelled = true;
      navigator.geolocation.clearWatch(watchId);
    };
  }, [gpsMissionId, updateMissionLocation]);

  const routePoints = useMemo(() => {
    const map: Record<string, { departure?: [number, number]; destination?: [number, number] }> = {};
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
    total:    missions.length,
    deviated: missions.filter((m) => getMarkerStatus(m) === "deviated").length,
    gpsOld:   missions.filter((m) => getMarkerStatus(m) === "gps_old").length,
    terminee: missions.filter((m) => (m as MissionWithEval).statut === "TERMINEE").length,
  }), [missions]);

  const center: [number, number] = [33.8869, 9.5375];
  const speedLabel = currentSpeed != null && Number.isFinite(currentSpeed)
    ? `${Math.round(currentSpeed)} km/h`
    : "-- km/h";
  const speedHint = !gpsMissionId
    ? "Selectionnez une mission"
    : gpsStatus === "unavailable"
      ? "GPS indisponible"
      : gpsStatus === "error"
        ? "GPS en attente"
        : gpsLastUpdate
          ? formatLastSeen(gpsLastUpdate)
          : "GPS actif";

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
        <Chip color="orange" label={`${counts.total} mission${counts.total > 1 ? "s" : ""}`} />
        {counts.deviated > 0 && (
          <Chip color="red" label={`${counts.deviated} déviation${counts.deviated > 1 ? "s" : ""}`} pulse />
        )}
        {counts.gpsOld > 0 && (
          <Chip color="orange" label={`${counts.gpsOld} GPS ancien${counts.gpsOld > 1 ? "s" : ""}`} />
        )}
        {counts.terminee > 0 && (
          <Chip color="purple" label={`${counts.terminee} à évaluer`} />
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

      {/* Vitesse mission en temps reel */}
      <div className="absolute top-16 right-4 z-[1000] bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-xl px-4 py-3 shadow-xl min-w-[180px]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-600/15 border border-orange-600/40 flex items-center justify-center text-orange-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vitesse mission</p>
            <p className="text-2xl font-black text-white leading-tight tabular-nums">{speedLabel}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-400">
          <span className={`w-1.5 h-1.5 rounded-full ${gpsStatus === "active" ? "bg-green-400 animate-pulse" : "bg-orange-400"}`} />
          <span className="truncate">{speedHint}</span>
        </div>
      </div>

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
        <RatingPanel mission={ratingMission} onClose={handleCloseRating} />
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

type ChipColor = "orange" | "red" | "purple";

function Chip({ color, label, pulse }: { color: ChipColor; label: string; pulse?: boolean }) {
  const styles: Record<ChipColor, string> = {
    red:    "bg-red-950/95 border-red-800 text-red-300",
    orange: "bg-zinc-900/95 border-zinc-700 text-white",
    purple: "bg-purple-950/95 border-purple-800 text-purple-300",
  };
  const dots: Record<ChipColor, string> = {
    red:    "bg-red-400",
    orange: "bg-orange-500",
    purple: "bg-purple-400",
  };
  return (
    <div className={`backdrop-blur border rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl text-xs font-bold ${styles[color]} ${pulse ? "animate-pulse" : ""}`}>
      <span className={`w-2 h-2 rounded-full ${dots[color]}`} />
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
        className={`w-5 flex-shrink-0 rounded ${!dashed ? `h-0.5 ${color} ${opacity ?? ""}` : ""}`}
        style={dashed ? { height: 0, borderTop: "2px dashed #ea580c" } : {}}
      />
      <span className="text-[11px] text-zinc-300">{label}</span>
    </div>
  );
}