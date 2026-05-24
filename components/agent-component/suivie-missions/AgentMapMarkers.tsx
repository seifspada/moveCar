"use client";
import { Marker, Popup, Polyline } from "react-leaflet";
import { divIcon } from "leaflet";
import Link from "next/link";
import { ActiveMission, getMarkerStatus, formatLastSeen } from "@/app/types/map-agent";
import { GPSTrack } from "@/app/types/map-agent";

// ── Icône véhicule SVG inline par type ──────────────────────
function getVehicleSVG(vehicleName: string, status: "normal" | "gps_old" | "deviated"): string {
  const borderColor = {
    normal:   "#22c55e",
    gps_old:  "#ea580c",
    deviated: "#dc2626",
  }[status];

  // Déduction du type de véhicule depuis le nom
  const name = vehicleName.toLowerCase();
  const isVan = name.includes("van") || name.includes("utilitaire") || name.includes("camion");
  const isSuv = name.includes("suv") || name.includes("4x4");
  const isCabrio = name.includes("cabrio") || name.includes("cabriolet");

  // SVG voiture de profil — 3 variants
  const carBody = isVan
    ? `<!-- Van/Utilitaire -->
       <rect x="4" y="14" width="38" height="18" rx="3" fill="white"/>
       <rect x="4" y="10" width="22" height="10" rx="2" fill="white" opacity="0.9"/>
       <circle cx="13" cy="34" r="5" fill="#374151" stroke="white" stroke-width="1.5"/>
       <circle cx="35" cy="34" r="5" fill="#374151" stroke="white" stroke-width="1.5"/>
       <rect x="26" y="12" width="14" height="7" rx="1" fill="#93c5fd" opacity="0.7"/>`
    : isCabrio
    ? `<!-- Cabriolet -->
       <path d="M8 22 Q24 10 40 22" stroke="white" stroke-width="2" fill="none"/>
       <rect x="4" y="22" width="38" height="10" rx="3" fill="white"/>
       <circle cx="13" cy="34" r="5" fill="#374151" stroke="white" stroke-width="1.5"/>
       <circle cx="35" cy="34" r="5" fill="#374151" stroke="white" stroke-width="1.5"/>`
    : `<!-- Berline/SUV -->
       <path d="M6 24 L10 14 Q24 8 38 14 L42 24 L42 32 L6 32 Z" fill="white"/>
       <path d="M11 14 Q24 8 37 14 L38 23 L10 23 Z" fill="#93c5fd" opacity="0.6"/>
       <circle cx="14" cy="34" r="5" fill="#374151" stroke="white" stroke-width="1.5"/>
       <circle cx="34" cy="34" r="5" fill="#374151" stroke="white" stroke-width="1.5"/>
       <rect x="6" y="23" width="36" height="9" rx="1" fill="white"/>`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.5)"/></filter>
  </defs>
  <!-- Fond carte -->
  <rect x="2" y="2" width="44" height="44" rx="10"
    fill="#18181b" stroke="${borderColor}" stroke-width="2.5" filter="url(#sh)"/>
  <!-- Indicateur statut (coin haut droit) -->
  <circle cx="38" cy="10" r="5" fill="${borderColor}" stroke="#18181b" stroke-width="1.5"/>
  <!-- Corps véhicule -->
  ${carBody}
</svg>`.trim();
}

function buildVehicleIcon(
  vehicleName: string,
  status: "normal" | "gps_old" | "deviated",
  selected: boolean
) {
  const size = selected ? 56 : 48;
  const svg = getVehicleIconSVG(vehicleName, status, selected, size);
  return divIcon({
    html: svg,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

function getVehicleIconSVG(
  vehicleName: string,
  status: "normal" | "gps_old" | "deviated",
  selected: boolean,
  size: number
): string {
  const borderColor = {
    normal:   "#22c55e",
    gps_old:  "#ea580c",
    deviated: "#dc2626",
  }[status];

  const name = vehicleName.toLowerCase();
  const isVan = name.includes("van") || name.includes("utilitaire") || name.includes("camion") || name.includes("vu");
  const isCabrio = name.includes("cabrio") || name.includes("cabriolet");

  const scale = size / 48;
  const carPath = isVan
    ? `<rect x="4" y="14" width="38" height="18" rx="3" fill="white"/>
       <rect x="4" y="10" width="22" height="10" rx="2" fill="white" opacity="0.9"/>
       <circle cx="13" cy="33" r="4.5" fill="#1f2937" stroke="#e5e7eb" stroke-width="1.5"/>
       <circle cx="35" cy="33" r="4.5" fill="#1f2937" stroke="#e5e7eb" stroke-width="1.5"/>
       <rect x="27" y="12" width="13" height="7" rx="1" fill="#93c5fd" opacity="0.7"/>
       <rect x="6" y="20" width="18" height="5" rx="1" fill="#93c5fd" opacity="0.5"/>`
    : isCabrio
    ? `<path d="M8 24 Q14 13 28 13 Q36 13 40 20 L42 24" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
       <rect x="4" y="24" width="40" height="9" rx="3" fill="white"/>
       <circle cx="14" cy="35" r="4.5" fill="#1f2937" stroke="#e5e7eb" stroke-width="1.5"/>
       <circle cx="34" cy="35" r="4.5" fill="#1f2937" stroke="#e5e7eb" stroke-width="1.5"/>`
    : `<path d="M7 25 L12 15 Q24 9 36 15 L41 25 L41 33 L7 33 Z" fill="white"/>
       <path d="M13 15 Q24 9 35 15 L37 24 L11 24 Z" fill="#bfdbfe" opacity="0.8"/>
       <circle cx="15" cy="35" r="4.5" fill="#1f2937" stroke="#e5e7eb" stroke-width="1.5"/>
       <circle cx="33" cy="35" r="4.5" fill="#1f2937" stroke="#e5e7eb" stroke-width="1.5"/>
       <rect x="7" y="24" width="34" height="9" rx="1" fill="white"/>
       <rect x="28" y="17" width="8" height="6" rx="1" fill="#bfdbfe" opacity="0.7"/>`;

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
  <rect x="2" y="2" width="44" height="44" rx="10"
    fill="#18181b" stroke="${borderColor}" stroke-width="${selected ? 3 : 2.5}"
    filter="url(#sh${size})"/>
  <circle cx="38" cy="10" r="5" fill="${borderColor}" stroke="#18181b" stroke-width="1.5"/>
  ${carPath}
</svg>`.trim();
}

// ── Types ────────────────────────────────────────────────────
interface AgentMapMarkersProps {
  missions: ActiveMission[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  trackHistory?: Record<string, GPSTrack[]>;   // historique GPS déjà chargé
  destinations?: Record<string, [number, number]>; // point d'arrivée par missionId
}

export default function AgentMapMarkers({
  missions,
  selectedId,
  onSelect,
  trackHistory = {},
  destinations = {},
}: AgentMapMarkersProps) {
  return (
    <>
      {missions.map((mission) => {
        const status = getMarkerStatus(mission);
        const isSelected = selectedId === mission.missionId;
        const history = trackHistory[mission.missionId] ?? [];
        const destination = destinations[mission.missionId];

        // ── Tracé passé (bleu) ──────────────────────────────
        const pastPath: [number, number][] = history.map((t) => [t.latitude, t.longitude]);

        // ── Tracé restant (orange) : position actuelle → destination ──
        const remainingPath: [number, number][] = destination
          ? [[mission.latitude, mission.longitude], destination]
          : [];

        return (
          <span key={mission.missionId}>
            {/* Trajectoire passée — bleu */}
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
            <Marker
              position={[mission.latitude, mission.longitude]}
              icon={buildVehicleIcon(mission.vehicleName, status, isSelected)}
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