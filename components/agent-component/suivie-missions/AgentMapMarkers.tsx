"use client";
import { Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import Link from "next/link";
import { ActiveMission, formatLastSeen, getMarkerStatus } from "@/app/types/map-agent";

function buildIcon(status: "normal" | "gps_old" | "deviated", selected: boolean) {
  const colors = {
    normal:   { fill: "#22c55e", stroke: "#15803d" },
    gps_old:  { fill: "#ea580c", stroke: "#9a3412" },
    deviated: { fill: "#dc2626", stroke: "#991b1b" },
  }[status];

  const size = selected ? 44 : 34;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 10}" viewBox="0 0 ${size} ${size + 10}">
  <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.45)"/></filter>
  <polygon points="${size/2-6},${size-1} ${size/2+6},${size-1} ${size/2},${size+9}"
    fill="${colors.fill}" filter="url(#sh)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}"
    fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2.5" filter="url(#sh)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2-9}" fill="white" opacity="0.9"/>
  ${selected ? `<circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="none" stroke="white" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.5"/>` : ""}
</svg>`.trim();

  return divIcon({
    html: svg,
    className: "",
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 9],
    popupAnchor: [0, -(size + 6)],
  });
}

interface AgentMapMarkersProps {
  missions: ActiveMission[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function AgentMapMarkers({
  missions,
  selectedId,
  onSelect,
}: AgentMapMarkersProps) {
  return (
    <>
      {missions.map((mission) => {
        const status = getMarkerStatus(mission);
        const isSelected = selectedId === mission.missionId;

        return (
          <Marker
            key={mission.missionId}
            position={[mission.latitude, mission.longitude]}
            icon={buildIcon(status, isSelected)}
            eventHandlers={{
              click: () => onSelect(isSelected ? null : mission.missionId),
            }}
          >
            <Popup
              closeButton={false}
              className="agent-map-popup"
              minWidth={260}
            >
              <div className="bg-zinc-900 rounded-xl overflow-hidden text-white text-sm shadow-2xl -m-3">
                {/* Status bar */}
                <div
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest ${
                    status === "normal"
                      ? "bg-green-900/60 text-green-400"
                      : status === "gps_old"
                      ? "bg-orange-900/60 text-orange-400"
                      : "bg-red-900/60 text-red-400"
                  }`}
                >
                  {status === "normal"
                    ? "● GPS normal"
                    : status === "gps_old"
                    ? "⚠ GPS ancien"
                    : "✕ Déviation détectée"}
                </div>

                {/* Content */}
                <div className="px-3 py-3 space-y-2">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Convoyeur</p>
                    <p className="font-semibold text-white">{mission.convoyeurName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Véhicule</p>
                    <p className="font-semibold text-white">{mission.vehicleName}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Position</p>
                      <p className="font-mono text-[11px] text-zinc-300">
                        {mission.latitude.toFixed(4)}, {mission.longitude.toFixed(4)}
                      </p>
                    </div>
                    {mission.accuracy && (
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Précision</p>
                        <p className="text-[11px] text-zinc-300">±{mission.accuracy}m</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Dernière MAJ</p>
                    <p className="text-[11px] text-zinc-300">{formatLastSeen(mission.lastGpsAt)}</p>
                  </div>
                </div>

                {/* CTA */}
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
        );
      })}
    </>
  );
}