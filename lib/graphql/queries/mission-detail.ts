// lib/graphql/queries/mission-detail.ts
import { gql } from '@apollo/client';

export const GET_MISSION_BY_ID = gql`
  query GetMissionById($id: String!) {
    getMissionById(id: $id) {
      id
      statut
      commentaire
      dateCreation
      partenaire {
        id
        nom
        prenom
        entiteGroupe
        entiteAgence
        email
        telephone
        logo
      }
      vehicule {
        id
        typeVehicule
        typeCarburant
        marqueModele
        immatriculation
        nombrePlaces
        boiteVitesse
      }
      adresseDepart {
        id
        villeNom
        adresseComplete
        typeLieu
        nomLieu
        latitude
        longitude
      }
      adresseArrivee {
        id
        villeNom
        adresseComplete
        typeLieu
        nomLieu
        latitude
        longitude
      }
      disponibilite {
        id
        dateDebut
        dateFin
        dateDepartMax
      }
      calculs {
        id
        distanceKm
        fraisPeage
        montantTotal
      }
      notifications {
        id
        typeNotification
        actif
        nomContact
        telephoneContact
      }
    }
  }
`;
