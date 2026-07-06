// src/types/mission-tracking.types.ts

export interface MissionCurrentLocation {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string; // ISO string côté GraphQL
  isDeviated: boolean;
  speed: number | null;
  accuracy: number | null;
}

export interface GetMissionCurrentLocationData {
  getMissionCurrentLocation: MissionCurrentLocation | null;
}

export interface GetMissionCurrentLocationVars {
  missionId: string;
}