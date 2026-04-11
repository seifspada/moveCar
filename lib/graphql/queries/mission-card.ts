// lib/graphql/queries/mission-card.ts
import { gql } from '@apollo/client';

export const GET_MISSIONS_FOR_CARDS = gql`
  query MissionsForCards {
    missionsForCards {
      id
      typeVehicule
      typeCarburant
      villeDepart
      villeArrivee
      distanceKm
      fraisPeage
      montantTotal
      dateDebut
      dateDepartMax
    }
  }
`;
export const GET_MISSIONS_BY_AGENCE = gql`
  query GetMissionsByAgence($agenceId: Int!) {
    getMissionsByAgence(agenceId: $agenceId) {
      id
      statut
      typeVehicule
      typeCarburant
      villeDepart
      villeArrivee
      distanceKm
      fraisPeage
      montantTotal
      dateDebut
      dateDepartMax
    }
  }
`;

export const SEARCH_MISSIONS = gql`
  query SearchMissions($search: String, $page: Int, $pageSize: Int) {
    searchMissions(search: $search, page: $page, pageSize: $pageSize) {
      missions {
        id
        typeVehicule
        typeCarburant
        villeDepart
        villeArrivee
        distanceKm
        fraisPeage
        montantTotal
        dateDebut
        dateDepartMax
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

// ✅ AJOUT DE export
export const SEARCH_MISSIONS_BY_POSITION = gql`
  query SearchMissionsByPosition(
    $filters: SearchByPositionInput!
    $page: Int
    $pageSize: Int
  ) {
    searchMissionsByPosition(
      filters: $filters
      page: $page
      pageSize: $pageSize
    ) {
      missions {
        id
        typeVehicule
        typeCarburant
        villeDepart
        villeArrivee
        distanceKm
        fraisPeage
        montantTotal
        dateDebut
        dateDepartMax
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

// ✅ AJOUT DE export
export const SEARCH_MISSIONS_BY_TRAJET = gql`
  query SearchMissionsByTrajet(
    $filters: SearchByTrajetInput!
    $page: Int
    $pageSize: Int
  ) {
    searchMissionsByTrajet(
      filters: $filters
      page: $page
      pageSize: $pageSize
    ) {
      missions {
        id
        typeVehicule
        typeCarburant
        villeDepart
        villeArrivee
        distanceKm
        fraisPeage
        montantTotal
        dateDebut
        dateDepartMax
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;
