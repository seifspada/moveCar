import { gql } from "@apollo/client";

export const GET_ACTIVE_MISSIONS_MAP = gql`
  query GetActiveMissionsMap {
    getActiveMissionsMap {
      missionId
      sessionId
      vehicleName
      convoyeurName
      status
      statut
      latitude
      longitude
      accuracy
      lastGpsAt
      isDeviated
      latitudeDepart
      longitudeDepart
      latitudeArrivee
      longitudeArrivee
      noteAgent
      scoreLogistique
      scorePredictedLabel
    }
  }
`;

export const GET_MISSION_TRACKING_HISTORY = gql`
  query GetMissionTrackingHistory($missionId: ID!) {
    getMissionTrackingHistory(missionId: $missionId) {
      id
      sessionId
      latitude
      longitude
      accuracy
      speed
      timestamp
      isDeviated
      distanceFromRoute
    }
  }
`;

export const UPDATE_MISSION_LOCATION = gql`
  mutation UpdateMissionLocation($input: UpdateLocationInput!) {
    updateMissionLocation(input: $input) {
      id
      latitude
      longitude
      speed
      timestamp
      isDeviated
    }
  }
`;
