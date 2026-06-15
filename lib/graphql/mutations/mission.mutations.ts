import { gql } from "@apollo/client";
 
export const NOTER_MISSION_CONVOYEUR = gql`
  mutation NoterMission($missionId: String!, $note: Float!) {
    noterMissionConvoyeur(missionId: $missionId, note: $note)
  }
`;
 