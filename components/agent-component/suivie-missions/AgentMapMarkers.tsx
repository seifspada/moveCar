// components/agent-component/suivie-missions/AgentMapMarkers.tsx
"use client";
import { useEffect, useState } from "react";
import { Marker, Popup, Polyline } from "react-leaflet";
import { divIcon } from "leaflet";
import Link from "next/link";
import { getMarkerStatus, formatLastSeen, GPSTrack } from "@/app/types/map-agent";
import { buildRoutePointIcon, RouteLineStyles } from "@/app/utils/route-point-icons";
import { MissionWithEval } from "./RatingPanal";

// ── Icône véhicule ───────────────────────────────────────────

function buildVehicleIcon(
  status: "normal" | "gps_old" | "deviated",
  selected: boolean,
  terminee: boolean
) {
  const size = selected ? 56 : 48;
  const borderColor = terminee
    ? "#a855f7"
    : { normal: "#22c55e", gps_old: "#ea580c", deviated: "#dc2626" }[status];

  const selectedRing = selected
    ? `<circle cx="24" cy="24" r="22" fill="none" stroke="${borderColor}" stroke-width="2" stroke-dasharray="4 3" opacity="0.7"/>`
    : "";

  const badge = terminee
    ? `<circle cx="38" cy="12" r="6" fill="#a855f7" stroke="#18181b" stroke-width="1.5"/>
       <text x="38" y="16" text-anchor="middle" font-size="7" fill="white">★</text>`
    : `<circle cx="38" cy="12" r="5" fill="${borderColor}" stroke="#18181b" stroke-width="1.5"/>`;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
  <defs>
    <filter id="sh${size}${terminee ? "t" : ""}">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.55)"/>
    </filter>
  </defs>
  ${selectedRing}
  <rect x="3" y="5" width="42" height="38" rx="10"
    fill="#18181b" stroke="${borderColor}" stroke-width="${selected ? 3 : 2.5}"
    filter="url(#sh${size}${terminee ? "t" : ""})"/>
  <path d="M8 27 L12 18 C13 15.8 15 14 17.5 14h13c2.5 0 4.5 1.8 5.5 4l4 9v7H8v-7Z" fill="#f8fafc"/>
  <path d="M14 18.5 C14.7 17 16 16 17.8 16h12.4c1.8 0 3.1 1 3.8 2.5l2.2 5H11.8l2.2-5Z" fill="#bfdbfe"/>
  <path d="M23 17 L19 24h4l-1.5 7 6-9h-4l1.5-5Z" fill="${borderColor}"/>
  <circle cx="15" cy="34" r="4.5" fill="#18181b" stroke="#e5e7eb" stroke-width="1.5"/>
  <circle cx="33" cy="34" r="4.5" fill="#18181b" stroke="#e5e7eb" stroke-width="1.5"/>
  ${badge}
</svg>`.trim();

  return divIcon({
    html: svg,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

// ── Route OSRM ───────────────────────────────────────────────

async function fetchRoadRoute(start: [number, number], end: [number, number]): Promise<[number, number][]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) return [start, end];
    const data = await res.json() as { routes?: Array<{ geometry?: { coordinates?: [number, number][] } }> };
    const coords = data.routes?.[0]?.geometry?.coordinates;
    if (!coords?.length) return [start, end];
    return coords.map(([lng, lat]) => [lat, lng]);
  } catch {
    return [start, end];
  }
}

// ── Types ────────────────────────────────────────────────────

interface AgentMapMarkersProps {
  missions: MissionWithEval[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onOpenRating: (mission: MissionWithEval) => void;
  trackHistory?: Record<string, GPSTrack[]>;
  routePoints?: Record<string, { departure?: [number, number]; destination?: [number, number] }>;
}

// ── Composant ────────────────────────────────────────────────

export default function AgentMapMarkers({
  missions,
  selectedId,
  onSelect,
  onOpenRating,
  trackHistory = {},
  routePoints = {},
}: AgentMapMarkersProps) {
  const [roadRoutes, setRoadRoutes] = useState<Record<string, {
    full?: [number, number][];
    remaining?: [number, number][];
  }>>({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const entries = await Promise.all(missions.map(async (m) => {
        const history = trackHistory[m.missionId] ?? [];
        const route   = routePoints[m.missionId] ?? {};
        const departure    = route.departure ?? (history[0] ? [history[0].latitude, history[0].longitude] as [number, number] : undefined);
        const current: [number, number] = [m.latitude, m.longitude];
        const destination  = route.destination;
        if (!destination) return [m.missionId, undefined] as const;
        const [full, remaining] = await Promise.all([
          departure ? fetchRoadRoute(departure, destination) : Promise.resolve(undefined),
          fetchRoadRoute(current, destination),
        ]);
        return [m.missionId, { full, remaining }] as const;
      }));
      if (cancelled) return;
      setRoadRoutes((prev) => {
        const next = { ...prev };
        entries.forEach(([id, route]) => { if (route) next[id] = route; else delete next[id]; });
        return next;
      });
    }
    load();
    return () => { cancelled = true; };
  }, [missions, routePoints, trackHistory]);

  return (
    <>
      {missions.map((mission) => {
        const status      = getMarkerStatus(mission);
        const isSelected  = selectedId === mission.missionId;
        const isTerminee  = mission.statut === "TERMINEE";
        const alreadyRated = (mission.noteAgent ?? 0) > 0;
        const history     = trackHistory[mission.missionId] ?? [];
        const route       = routePoints[mission.missionId] ?? {};
        const departure   = route.departure ?? (history[0] ? [history[0].latitude, history[0].longitude] as [number, number] : undefined);
        const destination = route.destination;

        const pastPath: [number, number][]       = history.map((t) => [t.latitude, t.longitude]);
        const remainingPath: [number, number][]  = destination ? [[mission.latitude, mission.longitude], destination] : [];
        const fullRoutePath: [number, number][]  = departure && destination ? [departure, destination] : [];
        const roadRoute          = roadRoutes[mission.missionId];
        const remainingRoadPath  = roadRoute?.remaining ?? remainingPath;
        const fullRoadPath       = roadRoute?.full ?? fullRoutePath;

        // Couleurs status bar
        const statusBarBg = isTerminee ? "rgba(88,28,135,0.5)"
          : status === "normal"   ? "rgba(20,83,45,0.7)"
          : status === "gps_old" ? "rgba(124,45,18,0.7)"
          : "rgba(127,29,29,0.7)";
        const statusColor = isTerminee ? "#c084fc"
          : status === "normal"   ? "#4ade80"
          : status === "gps_old" ? "#fb923c"
          : "#f87171";
        const statusLabel = isTerminee ? "Mission terminée"
          : status === "normal"   ? "GPS normal"
          : status === "gps_old" ? "GPS ancien"
          : "Déviation détectée";

        return (
          <span key={mission.missionId}>
            {/* Trajet complet départ → destination */}
            {fullRoadPath.length > 1 && (
              <Polyline positions={fullRoadPath} pathOptions={{ color: "#f97316", weight: 4, opacity: 0.3, lineCap: "round", lineJoin: "round" }} />
            )}
            {/* Trajectoire passée */}
            {pastPath.length > 1 && (
              <Polyline positions={pastPath} pathOptions={RouteLineStyles.pastTrack} />
            )}
            {/* Trajectoire restante */}
            {remainingRoadPath.length > 1 && (
              <Polyline positions={remainingRoadPath} pathOptions={RouteLineStyles.remainingTrack} />
            )}
            {/* Marqueur départ */}
            {departure && (
              <Marker position={departure} icon={buildRoutePointIcon("departure", "small")}>
                <Popup closeButton={false} minWidth={200}>
                  <div className="text-xs text-zinc-700 font-semibold">🚀 Ville de départ</div>
                </Popup>
              </Marker>
            )}
            {/* Marqueur destination */}
            {destination && (
              <Marker position={destination} icon={buildRoutePointIcon("destination", "small")}>
                <Popup closeButton={false} minWidth={200}>
                  <div className="text-xs text-zinc-700 font-semibold">🎯 Destination</div>
                </Popup>
              </Marker>
            )}

            {/* Marker véhicule */}
            <Marker
              position={[mission.latitude, mission.longitude]}
              icon={buildVehicleIcon(status, isSelected, isTerminee)}
              eventHandlers={{ click: () => onSelect(isSelected ? null : mission.missionId) }}
            >
              <Popup closeButton={false} className="agent-map-popup" minWidth={260}>
                <div style={{
                  background: "#18181b", borderRadius: "12px", overflow: "hidden",
                  color: "white", boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                  margin: "-12px", fontFamily: "system-ui,-apple-system,sans-serif", minWidth: "260px",
                }}>
                  {/* Status bar */}
                  <div style={{
                    padding: "6px 12px", fontSize: "11px", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    display: "flex", alignItems: "center", gap: "6px",
                    background: statusBarBg, color: statusColor,
                  }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, background: statusColor }} />
                    {statusLabel}
                  </div>

                  <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {/* Véhicule + convoyeur */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#27272a", border: "1px solid #3f3f46", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                        🚗
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: "13px", color: "#f4f4f5", margin: 0 }}>{mission.vehicleName}</p>
                        <p style={{ fontSize: "11px", color: "#71717a", margin: "2px 0 0" }}>{mission.convoyeurName}</p>
                      </div>
                    </div>

                    {/* Position + MAJ */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      <div style={{ background: "rgba(39,39,42,0.6)", borderRadius: "8px", padding: "6px 8px" }}>
                        <p style={{ fontSize: "9px", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>Position</p>
                        <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>
                          {mission.latitude.toFixed(4)}<br />{mission.longitude.toFixed(4)}
                        </p>
                      </div>
                      <div style={{ background: "rgba(39,39,42,0.6)", borderRadius: "8px", padding: "6px 8px" }}>
                        <p style={{ fontSize: "9px", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>Dernière MAJ</p>
                        <p style={{ fontSize: "10px", color: "#a1a1aa", margin: 0 }}>{formatLastSeen(mission.lastGpsAt)}</p>
                        {mission.accuracy && <p style={{ fontSize: "9px", color: "#52525b", margin: "2px 0 0" }}>±{mission.accuracy}m</p>}
                      </div>
                    </div>

                    {/* Bouton unique : évaluation si TERMINEE, détail sinon */}
                    {isTerminee ? (
                      <button
                        onClick={() => onOpenRating(mission)}
                        style={{
                          width: "100%", padding: "9px 12px", border: "none", borderRadius: "9px",
                          color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                          boxSizing: "border-box",
                          background: alreadyRated
                            ? "linear-gradient(135deg, #92400e, #78350f)"
                            : "linear-gradient(135deg, #ea580c, #dc4a00)",
                          boxShadow: "0 4px 14px rgba(234,88,12,0.35)",
                        }}
                      >
                        {alreadyRated ? (
                          <>
                            <span style={{ color: "#fbbf24" }}>{"★".repeat(mission.noteAgent ?? 0)}</span>
                            <span>Voir évaluation ({mission.noteAgent}/5)</span>
                          </>
                        ) : (
                          <><span>⭐</span><span>Voir détails mission →</span></>
                        )}
                      </button>
                    ) : (
                      <Link
                        href={`/agent/missions/${mission.missionId}`}
                        style={{
                          display: "block", width: "100%", textAlign: "center",
                          padding: "9px 12px", borderRadius: "9px", textDecoration: "none",
                          color: "#fff", fontSize: "12px", fontWeight: 700, boxSizing: "border-box",
                          background: "linear-gradient(135deg, #ea580c, #dc4a00)",
                          boxShadow: "0 4px 14px rgba(234,88,12,0.35)",
                        }}
                      >
                        Voir détails mission →
                      </Link>
                    )}
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