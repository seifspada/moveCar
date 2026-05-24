"use client";
import { useEffect, useState } from "react";
import { Marker, Popup, Polyline } from "react-leaflet";
import { divIcon } from "leaflet";
import Link from "next/link";
import { ActiveMission, getMarkerStatus, formatLastSeen } from "@/app/types/map-agent";
import { GPSTrack } from "@/app/types/map-agent";
import { buildRoutePointIcon, RouteLineStyles } from "@/app/utils/route-point-icons";

function buildVehicleIcon(
  status: "normal" | "gps_old" | "deviated",
  selected: boolean
) {
  const size = selected ? 56 : 48;
  const svg = getVehicleIconSVG(status, selected, size);
  return divIcon({
    html: svg,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

function getVehicleIconSVG(
  status: "normal" | "gps_old" | "deviated",
  selected: boolean,
  size: number
): string {
  const borderColor = {
    normal:   "#22c55e",
    gps_old:  "#ea580c",
    deviated: "#dc2626",
  }[status];

  const selectedRing = selected
    ? `<circle cx="24" cy="24" r="22" fill="none" stroke="${borderColor}" stroke-width="2" stroke-dasharray="4 3" opacity="0.7"/>`
    : "";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
  <defs>
    <filter id="sh${size}">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.55)"/>
    </filter>
  </defs>
  ${selectedRing}
  <rect x="3" y="5" width="42" height="38" rx="10"
    fill="#18181b" stroke="${borderColor}" stroke-width="${selected ? 3 : 2.5}"
    filter="url(#sh${size})"/>
  <path d="M8 27 L12 18 C13 15.8 15 14 17.5 14h13c2.5 0 4.5 1.8 5.5 4l4 9v7H8v-7Z" fill="#f8fafc"/>
  <path d="M14 18.5 C14.7 17 16 16 17.8 16h12.4c1.8 0 3.1 1 3.8 2.5l2.2 5H11.8l2.2-5Z" fill="#bfdbfe"/>
  <path d="M23 17 L19 24h4l-1.5 7 6-9h-4l1.5-5Z" fill="${borderColor}"/>
  <circle cx="15" cy="34" r="4.5" fill="#18181b" stroke="#e5e7eb" stroke-width="1.5"/>
  <circle cx="33" cy="34" r="4.5" fill="#18181b" stroke="#e5e7eb" stroke-width="1.5"/>
  <circle cx="38" cy="12" r="5" fill="${borderColor}" stroke="#18181b" stroke-width="1.5"/>
</svg>`.trim();
}

async function fetchRoadRoute(start: [number, number], end: [number, number]): Promise<[number, number][]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) return [start, end];

    const data = await response.json() as {
      routes?: Array<{ geometry?: { coordinates?: [number, number][] } }>;
    };
    const coordinates = data.routes?.[0]?.geometry?.coordinates;

    if (!coordinates?.length) return [start, end];
    return coordinates.map(([longitude, latitude]) => [latitude, longitude]);
  } catch (error) {
    console.error("Erreur OSRM:", error);
    return [start, end];
  }
}

// ── Types ────────────────────────────────────────────────────
interface AgentMapMarkersProps {
  missions: ActiveMission[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  trackHistory?: Record<string, GPSTrack[]>;
  routePoints?: Record<string, { 
    departure?: [number, number];
    destination?: [number, number] 
  }>;
}

export default function AgentMapMarkers({
  missions,
  selectedId,
  onSelect,
  trackHistory = {},
  routePoints = {},
}: AgentMapMarkersProps) {
  const [roadRoutes, setRoadRoutes] = useState<Record<string, {
    full?: [number, number][];
    remaining?: [number, number][];
  }>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadRoadRoutes() {
      const entries = await Promise.all(missions.map(async (mission) => {
        const history = trackHistory[mission.missionId] ?? [];
        const route = routePoints[mission.missionId] ?? {};
        const departure = route.departure ?? (history[0] ? ([history[0].latitude, history[0].longitude] as [number, number]) : undefined);
        const current = [mission.latitude, mission.longitude] as [number, number];
        const destination = route.destination;

        if (!destination) return [mission.missionId, undefined] as const;

        const [full, remaining] = await Promise.all([
          departure ? fetchRoadRoute(departure, destination) : Promise.resolve(undefined),
          fetchRoadRoute(current, destination),
        ]);

        return [mission.missionId, { full, remaining }] as const;
      }));

      if (cancelled) return;

      setRoadRoutes((prev) => {
        const next = { ...prev };
        entries.forEach(([missionId, route]) => {
          if (route) next[missionId] = route;
          else delete next[missionId];
        });
        return next;
      });
    }

    loadRoadRoutes();

    return () => {
      cancelled = true;
    };
  }, [missions, routePoints, trackHistory]);

  return (
    <>
      {missions.map((mission) => {
        const status = getMarkerStatus(mission);
        const isSelected = selectedId === mission.missionId;
        const history = trackHistory[mission.missionId] ?? [];
        const route = routePoints[mission.missionId] ?? {};
        const departure = route.departure ?? (history[0] ? ([history[0].latitude, history[0].longitude] as [number, number]) : undefined);
        const destination = route.destination;

        // ── Tracé passé (bleu) ──────────────────────────────
        const pastPath: [number, number][] = history.map((t) => [t.latitude, t.longitude]);

        // ── Tracé restant (orange) : position actuelle → destination ──
        const remainingPath: [number, number][] = destination
          ? [[mission.latitude, mission.longitude], destination]
          : [];
        const fullRoutePath: [number, number][] = departure && destination
          ? [departure, destination]
          : [];
        const roadRoute = roadRoutes[mission.missionId];
        const remainingRoadPath = roadRoute?.remaining ?? remainingPath;
        const fullRoadPath = roadRoute?.full ?? fullRoutePath;

        return (
          <span key={mission.missionId}>
            {/* ✅ Trajet complet (départ → destination) en route réelle */}
            {fullRoadPath.length > 1 && (
              <Polyline
                positions={fullRoadPath}
                pathOptions={{
                  color: "#f97316",
                  weight: 4,
                  opacity: 0.3,
                  lineCap: "round" as const,
                  lineJoin: "round" as const,
                }}
              />
            )}

            {/* Trajectoire passée — bleu ciel avec fond léger */}
            {pastPath.length > 1 && (
              <Polyline
                positions={pastPath}
                pathOptions={RouteLineStyles.pastTrack}
              />
            )}

            {/* Trajectoire restante — orange pointillée */}
            {remainingRoadPath.length > 1 && (
              <Polyline
                positions={remainingRoadPath}
                pathOptions={RouteLineStyles.remainingTrack}
              />
            )}

            {/* ✅ Marqueur icône départ (ville de départ) — icône unifiée */}
            {departure && (
              <Marker 
                position={departure} 
                icon={buildRoutePointIcon("departure", "small")}
              >
                <Popup closeButton={false} minWidth={200}>
                  <div className="text-xs text-zinc-700 font-semibold">
                    🚀 Ville de départ
                  </div>
                </Popup>
              </Marker>
            )}

            {/* ✅ Marqueur icône destination (arrivée) — icône unifiée */}
            {destination && (
              <Marker 
                position={destination} 
                icon={buildRoutePointIcon("destination", "small")}
              >
                <Popup closeButton={false} minWidth={200}>
                  <div className="text-xs text-zinc-700 font-semibold">
                    🎯 Destination
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Marker icône véhicule */}
            <Marker
              position={[mission.latitude, mission.longitude]}
              icon={buildVehicleIcon(status, isSelected)}
              eventHandlers={{
                click: () => onSelect(isSelected ? null : mission.missionId),
              }}
            >
              <Popup closeButton={false} className="agent-map-popup" minWidth={270}>
                <div className="bg-zinc-900 rounded-xl overflow-hidden text-white shadow-2xl -m-3">
                  {/* Status bar */}
                  <div className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                    status === "normal"   ? "bg-green-950/80 text-green-400"
                    : status === "gps_old" ? "bg-orange-950/80 text-orange-400"
                    : "bg-red-950/80 text-red-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      status === "normal" ? "bg-green-400"
                      : status === "gps_old" ? "bg-orange-400 animate-pulse"
                      : "bg-red-400 animate-pulse"
                    }`}/>
                    {status === "normal" ? "GPS normal"
                      : status === "gps_old" ? "GPS ancien"
                      : "Déviation détectée"}
                  </div>

                  <div className="px-3 py-3 space-y-2.5">
                    {/* Véhicule + convoyeur */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 text-lg">
                        🚗
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{mission.vehicleName}</p>
                        <p className="text-xs text-zinc-400">{mission.convoyeurName}</p>
                      </div>
                    </div>

                    {/* Position + MAJ */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-zinc-800/60 rounded-lg px-2 py-1.5">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">Position</p>
                        <p className="font-mono text-[11px] text-zinc-300 leading-tight">
                          {mission.latitude.toFixed(4)}<br/>{mission.longitude.toFixed(4)}
                        </p>
                      </div>
                      <div className="bg-zinc-800/60 rounded-lg px-2 py-1.5">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">Dernière MAJ</p>
                        <p className="text-[11px] text-zinc-300">{formatLastSeen(mission.lastGpsAt)}</p>
                        {mission.accuracy && (
                          <p className="text-[10px] text-zinc-500">±{mission.accuracy}m</p>
                        )}
                      </div>
                    </div>

                    {/* Stats trajet si historique disponible */}
                    {history.length > 0 && (
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-0.5 bg-blue-400 inline-block rounded"/>
                          <span className="text-blue-400">{history.length} points</span>
                        </span>
                        {destination && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-0.5 bg-orange-400 inline-block rounded" style={{borderTop: "2px dashed #ea580c", background:"none"}}/>
                            <span className="text-orange-400">Trajet restant</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="px-3 pb-3">
                    <Link
                      href={`/agent/missions/${mission.missionId}`}
                      className="block w-full text-center py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Voir détails mission →
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          </span>
        );
      })}
    </>
  );
}