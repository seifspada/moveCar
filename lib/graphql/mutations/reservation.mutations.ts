// lib/graphql/mutations/reservation.mutations.ts
import { gql } from '@apollo/client';

/**
 * ✅ Créer une réservation (AVEC ReservationResponse)
 */
export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      success
      message
      code
      reservation {
        id
        numeroReservation
        statut
        dateDepart
        heureDepart
        dateArrivee
        heureArrivee
        dureeEstimee
        montantTotal
        fraisPeage
        distanceKm
        dateCreation
      }
    }
  }
`;

/**
 * ✅ Annuler une réservation
 */
export const CANCEL_RESERVATION = gql`
  mutation CancelReservation($id: String!) {
    cancelReservation(id: $id) {
      id
      numeroReservation
      statut
    }
  }
`;
