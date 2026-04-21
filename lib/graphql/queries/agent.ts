// lib/queries/agent.ts
import { gql } from "@apollo/client";

export const GET_AGENT_NAVBAR = gql`
  query GetAgentNavbar {
    agentMe {
    id
      nom
      email
      photo
      agenceId
    }
  }
`;
