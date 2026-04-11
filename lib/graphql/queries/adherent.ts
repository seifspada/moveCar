// lib/queries/adherent.ts (ou graphql/queries/adherent.ts)
import { gql } from '@apollo/client';

export const GET_ADHERENT_NAVBAR = gql`
  query AdherentMe {
    adherentMe {
      nom
      prenom
      email
      photo
      typePack
    }
  }
`;
