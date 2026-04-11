// lib/queries/agent.ts
import { gql } from "@apollo/client";

export const GET_ADMIN_NAVBAR = gql`
  query GetAdminNavbar {
    adminMe {
      nom
      email
      
    }
  }
`;
