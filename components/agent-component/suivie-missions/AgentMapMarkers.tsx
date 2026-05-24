"use client";
import { Marker, Popup, Polyline } from "react-leaflet";
import { divIcon } from "leaflet";
import Link from "next/link";
import { ActiveMission, getMarkerStatus, formatLastSeen } from "@/app/types/map-agent";
import { GPSTrack } from "@/app/types/map-agent";

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
  <path d="M24 3 C14 3 6 11 6 21 c0 13 18 24 18 24 s18-11 18-24 C42 11 34 3 24 3Z"
    fill="#18181b" stroke="${borderColor}" stroke-width="${selected ? 3 : 2.5}"
    filter="url(#sh${size})"/>
  <circle cx="24" cy="21" r="11" fill="${borderColor}" opacity="0.2"/>
  <path d="M27 8 L15 24 h8 l-2 11 12-17 h-8 l2-10Z" fill="#f8fafc"/>
  <circle cx="37" cy="11" r="5" fill="${borderColor}" stroke="#18181b" stroke-width="1.5"/>
</svg>`.trim();
}

function buildRoutePointIcon(type: "departure" | "destination") {
  const isDeparture = type === "departure";
  const color = isDeparture ? "#06b6d4" : "#f97316";
  const label = isDeparture ? "D" : "A";
  const symbol = isDeparture
    ? `<path d="M16 28 V15 h9.5 c3 0 5 1.8 5 4.5s-2 4.5-5 4.5H16" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M16 29 24 13l8 16M19 24h10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;

  return divIcon({
    className: "",
    iconSize: [36, 44],
    iconAnchor: [18, 42],
    popupAnchor: [0, -38],
    html: `
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
  <defs><filter id="route-${type}"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.55)"/></filter></defs>
  <path d="M18 2 C9.7 2 3 8.7 3 17 c0 11 15 25 15 25s15-14 15-25C33 8.7 26.3 2 18 2Z"
    fill="#18181b" stroke="${color}" stroke-width="2.5" filter="url(#route-${type})"/>
  <circle cx="18" cy="17" r="11" fill="${color}"/>
  ${symbol}
  <text x="18" y="39" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="700" fill="white">${label}</text>
</svg>`.trim(),
  });
}

// ── Types ────────────────────────────────────────────────────
interface AgentMapMarkersProps {
  missions: ActiveMission[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  trackHistory?: Record<string, GPSTrack[]>;
  routePoints?: Record<string, { departure?: [number, number]; destination?: [number, number] }>;
}

export default function AgentMapMarkers({
  missions,
  selectedId,
  onSelect,
  trackHistory = {},
  routePoints = {},
}: AgentMapMarkersProps) {
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

        return (
          <span key={mission.missionId}>
            {/* Trajectoire passée — bleu */}
            {fullRoutePath.length === 2 && (
              <Polyline
                positions={fullRoutePath}
                pathOptions={{
                  color: "#06b6d4",
                  weight: 4,
                  opacity: 0.45,
                }}
              />
            )}

            {pastPath.length > 1 && (
              <Polyline
                positions={pastPath}
                pathOptions={{
                  color: "#3b82f6",
                  weight: 3,
                  opacity: 0.75,
                  dashArray: undefined,
                }}
              />
            )}

            {/* Trajectoire restante — orange */}
            {remainingPath.length === 2 && (
              <Polyline
                positions={remainingPath}
                pathOptions={{
                  color: "#ea580c",
                  weight: 3,
                  opacity: 0.8,
                  dashArray: "8 6",
                }}
              />
            )}

            {/* Marker icône véhicule */}
            {departure && (
              <Marker position={departure} icon={buildRoutePointIcon("departure")} />
            )}

            {destination && (
              <Marker position={destination} icon={buildRoutePointIcon("destination")} />
            )}

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


