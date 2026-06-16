// app/types/map-agent.ts

export type MarkerStatus = "normal" | "gps_old" | "deviated";

export interface ActiveMission {
  missionId: string;
  sessionId: string;
  vehicleName: string;
  convoyeurName: string;
  status: string;
  statut?: string;                      // EN_COURS | TERMINEE | PROBLEME_TRAJET
  latitude: number;
  longitude: number;
  accuracy: number | null;
  lastGpsAt: string;
  isDeviated: boolean;
  latitudeDepart?: number;
  longitudeDepart?: number;
  latitudeArrivee?: number;
  longitudeArrivee?: number;
  // Phase 3 — évaluation
  noteAgent?: number | null;
  scoreLogistique?: number | null;
  scorePredictedLabel?: string | null;
}

export interface GPSTrack {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: string;
  isDeviated: boolean;
  distanceFromRoute: number | null;
}

export function getMarkerStatus(mission: ActiveMission): MarkerStatus {
  if (mission.isDeviated) return "deviated";
  const diffMin = (Date.now() - new Date(mission.lastGpsAt).getTime()) / 60000;
  return diffMin > 10 ? "gps_old" : "normal";
}

export function formatLastSeen(iso: string): string {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const h = Math.floor(diffMin / 60);
  return `Il y a ${h}h`;
}