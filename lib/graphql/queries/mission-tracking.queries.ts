// src/graphql/queries/mission-tracking.queries.ts
import { gql } from '@apollo/client';

export const GET_MISSION_CURRENT_LOCATION = gql`
  query GetMissionCurrentLocation($missionId: ID!) {
    getMissionCurrentLocation(missionId: $missionId) {
      id
      latitude
      longitude
      timestamp
      isDeviated
      speed
      accuracy
    }
  }
`;