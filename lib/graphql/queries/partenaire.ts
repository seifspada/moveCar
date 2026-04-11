// lib/graphql/queries/partenaire.ts

import { gql } from "@apollo/client";

export const GET_PARTENAIRE_NAVBAR = gql`
  query PartenaireNavbar {
    partenaireNavbar {
      entite
      email
      photo    
    }
  }
`;

