"use client";
import { useEffect, useState, useCallback } from "react";
import { Marker, Popup, Polyline } from "react-leaflet";
import { divIcon } from "leaflet";
import Link from "next/link";
import { ActiveMission, getMarkerStatus, formatLastSeen } from "@/app/types/map-agent";
import { GPSTrack } from "@/app/types/map-agent";
import { buildRoutePointIcon, RouteLineStyles } from "@/app/utils/route-point-icons";
import { NOTER_MISSION_CONVOYEUR } from "@/lib/graphql/mutations/mission.mutations";
import { useMutation } from "@apollo/client/react";

// ── Icône véhicule ───────────────────────────────────────────

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

// ── Fetch route OSRM ─────────────────────────────────────────

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

// ── Composant étoiles ────────────────────────────────────────

interface StarRatingProps {
  value: number;
  onChange: (note: number) => void;
  disabled?: boolean;
}

function StarRating({ value, onChange, disabled }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hovered || value);
        return (
          <button
            key={star}
            disabled={disabled}
            onMouseEnter={() => !disabled && setHovered(star)}
            onMouseLeave={() => !disabled && setHovered(0)}
            onClick={() => !disabled && onChange(star)}
            style={{
              background: "none",
              border: "none",
              cursor: disabled ? "default" : "pointer",
              padding: "2px",
              fontSize: "22px",
              lineHeight: 1,
              color: active ? "#f59e0b" : "#3f3f46",
              transform: active ? "scale(1.15)" : "scale(1)",
              transition: "transform 0.15s, color 0.15s",
              filter: active ? "drop-shadow(0 0 4px rgba(245,158,11,0.5))" : "none",
            }}
            title={`${star} étoile${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

// ── Carte résultat IA ────────────────────────────────────────

interface AIScoreCardProps {
  noteAgent: number;
  scoreLogistique: number;
  scorePredictedLabel: string;
}

function AIScoreCard({ noteAgent, scoreLogistique, scorePredictedLabel }: AIScoreCardProps) {
  const percent = Math.round(scoreLogistique * 100);

  const scoreColor =
    percent >= 80 ? "#22c55e"
    : percent >= 50 ? "#f97316"
    : "#ef4444";

  const scoreBg =
    percent >= 80 ? "rgba(34,197,94,0.1)"
    : percent >= 50 ? "rgba(249,115,22,0.1)"
    : "rgba(239,68,68,0.1)";

  const scoreBorder =
    percent >= 80 ? "rgba(34,197,94,0.3)"
    : percent >= 50 ? "rgba(249,115,22,0.3)"
    : "rgba(239,68,68,0.3)";

  return (
    <div style={{
      background: "rgba(24,24,27,0.98)",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #27272a",
      marginTop: "4px",
    }}>
      {/* Header */}
      <div style={{
        padding: "8px 12px",
        background: "linear-gradient(135deg, rgba(234,88,12,0.15), rgba(234,88,12,0.05))",
        borderBottom: "1px solid #27272a",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}>
        <span style={{ fontSize: "14px" }}>✅</span>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Mission évaluée
        </span>
      </div>

      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Note agent */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "#71717a", marginBottom: "4px" }}>
            Note de l&apos;agent
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "18px", color: "#f59e0b", letterSpacing: "1px" }}>
              {"★".repeat(noteAgent)}{"☆".repeat(5 - noteAgent)}
            </span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#e4e4e7" }}>
              {noteAgent}/5
            </span>
          </div>
        </div>

        {/* Score IA */}
        <div style={{
          background: scoreBg,
          border: `1px solid ${scoreBorder}`,
          borderRadius: "8px",
          padding: "8px 10px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "10px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
              Score IA
            </span>
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              color: scoreColor,
              background: `rgba(${scoreColor === "#22c55e" ? "34,197,94" : scoreColor === "#f97316" ? "249,115,22" : "239,68,68"},0.15)`,
              padding: "1px 7px",
              borderRadius: "20px",
            }}>
              {scorePredictedLabel}
            </span>
          </div>

          {/* Barre de progression */}
          <div style={{
            height: "5px",
            background: "#27272a",
            borderRadius: "99px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${percent}%`,
              background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}cc)`,
              borderRadius: "99px",
              transition: "width 0.6s ease",
              boxShadow: `0 0 6px ${scoreColor}66`,
            }} />
          </div>

          <div style={{
            textAlign: "right",
            fontSize: "11px",
            fontWeight: 700,
            color: scoreColor,
            marginTop: "3px",
          }}>
            {percent}%
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Bloc évaluation dans la popup ───────────────────────────

interface MissionRatingBlockProps {
  mission: ActiveMission & {
    statut?: string;
    noteAgent?: number | null;
    scoreLogistique?: number | null;
    scorePredictedLabel?: string | null;
  };
}

function MissionRatingBlock({ mission }: MissionRatingBlockProps) {
  const [note, setNote] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [localNote, setLocalNote] = useState<number | null>(null);

  const [noterMission, { loading, error }] = useMutation<
    { noterMissionConvoyeur: boolean },
    { missionId: string; note: Float }
  >(NOTER_MISSION_CONVOYEUR);

  // Déjà noté côté backend
  const alreadyRated =
    submitted ||
    (mission.noteAgent != null && mission.scoreLogistique != null);

  const displayNote = localNote ?? mission.noteAgent ?? 0;
  const displayScore = mission.scoreLogistique ?? 0;
  const displayLabel = mission.scorePredictedLabel ?? "N/A";

  const handleSubmit = useCallback(async () => {
    if (!note || note < 1 || note > 5) return;
    try {
      await noterMission({
        variables: { missionId: mission.missionId, note: note as Float },
      });
      setLocalNote(note);
      setSubmitted(true);
    } catch (e) {
      console.error("Erreur notation:", e);
    }
  }, [note, mission.missionId, noterMission]);

  if (mission.statut !== "TERMINEE") return null;

  if (alreadyRated) {
    return (
      <AIScoreCard
        noteAgent={displayNote}
        scoreLogistique={displayScore}
        scorePredictedLabel={displayLabel}
      />
    );
  }

  return (
    <div style={{
      background: "rgba(24,24,27,0.98)",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #27272a",
      marginTop: "4px",
    }}>
      {/* Header */}
      <div style={{
        padding: "8px 12px",
        background: "linear-gradient(135deg, rgba(234,88,12,0.15), rgba(234,88,12,0.05))",
        borderBottom: "1px solid #27272a",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}>
        <span style={{ fontSize: "14px" }}>⭐</span>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Évaluer le convoyeur
        </span>
      </div>

      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ fontSize: "11px", color: "#71717a", textAlign: "center", margin: 0 }}>
          Mission terminée · Donnez votre avis
        </p>

        <StarRating value={note} onChange={setNote} disabled={loading} />

        {note > 0 && (
          <p style={{
            textAlign: "center",
            fontSize: "11px",
            color: "#f59e0b",
            margin: 0,
            fontWeight: 600,
          }}>
            {["", "Insuffisant", "Passable", "Bien", "Très bien", "Excellent"][note]}
          </p>
        )}

        {error && (
          <p style={{ fontSize: "10px", color: "#ef4444", textAlign: "center", margin: 0 }}>
            Erreur : {error.message}
          </p>
        )}

        <button
          disabled={!note || loading}
          onClick={handleSubmit}
          style={{
            background: !note || loading
              ? "#27272a"
              : "linear-gradient(135deg, #ea580c, #dc4a00)",
            color: !note || loading ? "#52525b" : "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: !note || loading ? "not-allowed" : "pointer",
            width: "100%",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            boxShadow: note && !loading ? "0 2px 12px rgba(234,88,12,0.35)" : "none",
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: "10px", height: "10px", border: "2px solid #71717a",
                borderTopColor: "transparent", borderRadius: "50%",
                display: "inline-block", animation: "spin 0.7s linear infinite",
              }} />
              Envoi…
            </>
          ) : (
            "Valider l'évaluation"
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Types ────────────────────────────────────────────────────

// Extend Float type alias for the mutation variable
type Float = number;

interface AgentMapMarkersProps {
  missions: (ActiveMission & {
    statut?: string;
    noteAgent?: number | null;
    scoreLogistique?: number | null;
    scorePredictedLabel?: string | null;
  })[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  trackHistory?: Record<string, GPSTrack[]>;
  routePoints?: Record<string, {
    departure?: [number, number];
    destination?: [number, number];
  }>;
}

// ── Composant principal ──────────────────────────────────────

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
    return () => { cancelled = true; };
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

        const pastPath: [number, number][] = history.map((t) => [t.latitude, t.longitude]);
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
            {/* Trajet complet (départ → destination) */}
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

            {/* Trajectoire passée — bleu ciel */}
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

            {/* Marqueur départ */}
            {departure && (
              <Marker
                position={departure}
                icon={buildRoutePointIcon("departure", "small")}
              >
                <Popup closeButton={false} minWidth={200}>
                  <div className="text-xs text-zinc-700 font-semibold">🚀 Ville de départ</div>
                </Popup>
              </Marker>
            )}

            {/* Marqueur destination */}
            {destination && (
              <Marker
                position={destination}
                icon={buildRoutePointIcon("destination", "small")}
              >
                <Popup closeButton={false} minWidth={200}>
                  <div className="text-xs text-zinc-700 font-semibold">🎯 Destination</div>
                </Popup>
              </Marker>
            )}

            {/* Marker véhicule — popup avec évaluation */}
            <Marker
              position={[mission.latitude, mission.longitude]}
              icon={buildVehicleIcon(status, isSelected)}
              eventHandlers={{
                click: () => onSelect(isSelected ? null : mission.missionId),
              }}
            >
              <Popup
                closeButton={false}
                className="agent-map-popup"
                minWidth={285}
                maxWidth={310}
              >
                <div style={{
                  background: "#18181b",
                  borderRadius: "12px",
                  overflow: "hidden",
                  color: "white",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                  margin: "-12px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}>
                  {/* Status bar */}
                  <div style={{
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: status === "normal"
                      ? "rgba(20,83,45,0.7)"
                      : status === "gps_old"
                      ? "rgba(124,45,18,0.7)"
                      : "rgba(127,29,29,0.7)",
                    color: status === "normal" ? "#4ade80"
                      : status === "gps_old" ? "#fb923c"
                      : "#f87171",
                  }}>
                    <span style={{
                      width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                      background: status === "normal" ? "#4ade80"
                        : status === "gps_old" ? "#fb923c"
                        : "#f87171",
                    }} />
                    {status === "normal" ? "GPS normal"
                      : status === "gps_old" ? "GPS ancien"
                      : "Déviation détectée"}
                  </div>

                  <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {/* Véhicule + convoyeur */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "38px", height: "38px", borderRadius: "8px",
                        background: "#27272a", border: "1px solid #3f3f46",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px", flexShrink: 0,
                      }}>
                        🚗
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: "13px", color: "#f4f4f5", margin: 0 }}>
                          {mission.vehicleName}
                        </p>
                        <p style={{ fontSize: "11px", color: "#71717a", margin: "2px 0 0" }}>
                          {mission.convoyeurName}
                        </p>
                      </div>
                    </div>

                    {/* Position + MAJ */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      <div style={{
                        background: "rgba(39,39,42,0.6)", borderRadius: "8px",
                        padding: "6px 8px",
                      }}>
                        <p style={{ fontSize: "9px", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>
                          Position
                        </p>
                        <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>
                          {mission.latitude.toFixed(4)}<br />{mission.longitude.toFixed(4)}
                        </p>
                      </div>
                      <div style={{
                        background: "rgba(39,39,42,0.6)", borderRadius: "8px",
                        padding: "6px 8px",
                      }}>
                        <p style={{ fontSize: "9px", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>
                          Dernière MAJ
                        </p>
                        <p style={{ fontSize: "10px", color: "#a1a1aa", margin: 0 }}>
                          {formatLastSeen(mission.lastGpsAt)}
                        </p>
                        {mission.accuracy && (
                          <p style={{ fontSize: "9px", color: "#52525b", margin: "2px 0 0" }}>
                            ±{mission.accuracy}m
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats trajet */}
                    {history.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "8px", height: "2px", background: "#60a5fa", display: "inline-block", borderRadius: "1px" }} />
                          <span style={{ color: "#60a5fa" }}>{history.length} points</span>
                        </span>
                        {destination && (
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ width: "8px", height: 0, borderTop: "2px dashed #ea580c", display: "inline-block" }} />
                            <span style={{ color: "#fb923c" }}>Trajet restant</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* ── Bloc évaluation (Phase 3) ── */}
                    <MissionRatingBlock mission={mission} />

                    {/* Lien détails */}
                    <Link
                      href={`/agent/missions/${mission.missionId}`}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        padding: "7px 12px",
                        background: "#ea580c",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: 700,
                        borderRadius: "8px",
                        textDecoration: "none",
                        boxSizing: "border-box",
                      }}
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