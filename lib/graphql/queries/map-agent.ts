import { gql } from "@apollo/client";

export const GET_ACTIVE_MISSIONS_MAP = gql`
 query GetActiveMissionsMap {
  getActiveMissionsMap {
    missionId
    sessionId
    vehicleName
    convoyeurName
    status
    latitude
    longitude
    accuracy
    lastGpsAt
    isDeviated
    latitudeArrivee   # ← à ajouter
    longitudeArrivee  # ← à ajouter
  }
}
`;

export const GET_MISSION_TRACKING_HISTORY = gql`
  query GetMissionTrackingHistory($missionId: ID!) {
    getMissionTrackingHistory(missionId: $missionId) {
      id
      latitude
      longitude
      accuracy
      timestamp
      isDeviated
      distanceFromRoute
    }
  }
`;