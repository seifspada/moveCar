// lib/graphql/queries/reservation.queries.ts
import { gql } from '@apollo/client';

// ─────────────────────────────────────────────
// FRAGMENT
// ─────────────────────────────────────────────

export const RESERVATION_FIELDS = gql`
  fragment ReservationFields on ReservationMissionEntity {
    id
    missionId
    numeroReservation
    statut
    statutPrecedent
    dateDepart
    heureDepart
    dateArrivee
    heureArrivee
    dureeEstimee
    montantTotal
    fraisPeage
    distanceKm
    motifRefus
    motifAnnulation
    annulePar
    dateValidation
    dateAcceptationAgent
    dateConfirmationAdherent
    dateAnnulation

    adherent {
      id
      nom
      prenom
      telephone
      user {
        name
        email
        photo
      }
    }

    mission {
      id
      statut
      adresseDepart {
        villeNom
      }
      adresseArrivee {
        villeNom
      }
    }
  }
`;

// ─────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────

export const GET_MY_RESERVATIONS = gql`
  ${RESERVATION_FIELDS}
  query GetMyReservations {
    myReservations {
      ...ReservationFields
    }
  }
`;

export const GET_ALL_RESERVATIONS = gql`
  ${RESERVATION_FIELDS}
  query GetAllReservations {
    allReservations {
      ...ReservationFields
    }
  }
`;

export const GET_RESERVATION_BY_ID = gql`
  ${RESERVATION_FIELDS}
  query GetReservationById($id: String!) {
    reservationById(id: $id) {
      ...ReservationFields
    }
  }
`;

// ✅ FIX: query manquante — cause du ReferenceError dans useReservations.ts
export const GET_RESERVATIONS_BY_MISSION = gql`
  ${RESERVATION_FIELDS}
  query GetReservationsByMission($missionId: String!) {
    reservationsByMission(missionId: $missionId) {
      ...ReservationFields
    }
  }
`;

// ─────────────────────────────────────────────
// MUTATIONS — ADHÉRENT
// ─────────────────────────────────────────────

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      success
      message
      code
      reservation {
        id
        missionId
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
      }
    }
  }
`;

export const CANCEL_RESERVATION = gql`
  mutation CancelReservation($id: String!, $motifAnnulation: String) {
    cancelReservation(id: $id, motifAnnulation: $motifAnnulation) {
      id
      missionId
      numeroReservation
      statut
      dateAnnulation
      motifAnnulation
      annulePar
    }
  }
`;

export const CONFIRM_RESERVATION_BY_ADHERENT = gql`
  mutation ConfirmReservationByAdherent($id: String!) {
    confirmReservationByAdherent(id: $id) {
      id
      missionId
      numeroReservation
      statut
      dateConfirmationAdherent
    }
  }
`;

export const REQUEST_CANCELLATION = gql`
  mutation RequestCancellation($id: String!, $motifAnnulation: String!) {
    requestCancellation(id: $id, motifAnnulation: $motifAnnulation) {
      id
      missionId
      numeroReservation
      statut
      statutPrecedent
      motifAnnulation
    }
  }
`;

// ─────────────────────────────────────────────
// MUTATIONS — AGENT
// ─────────────────────────────────────────────

export const ACCEPT_RESERVATION = gql`
  mutation AcceptReservation($id: String!) {
    acceptReservation(id: $id) {
      id
      missionId
      numeroReservation
      statut
      dateAcceptationAgent
    }
  }
`;

export const REFUSE_RESERVATION = gql`
  mutation RefuseReservation($id: String!, $motifRefus: String!) {
    refuseReservation(id: $id, motifRefus: $motifRefus) {
      id
      missionId
      numeroReservation
      statut
      motifRefus
      dateRefus
    }
  }
`;

export const ACCEPT_CANCELLATION_REQUEST = gql`
  mutation AcceptCancellationRequest($id: String!) {
    acceptCancellationRequest(id: $id) {
      id
      missionId
      numeroReservation
      statut
      dateAnnulation
      annulePar
    }
  }
`;

export const REFUSE_CANCELLATION_REQUEST = gql`
  mutation RefuseCancellationRequest($id: String!, $motifRefus: String!) {
    refuseCancellationRequest(id: $id, motifRefus: $motifRefus) {
      id
      missionId
      numeroReservation
      statut
      statutPrecedent
      motifRefus
    }
  }
`;


export const CANCEL_PENDING_RESERVATION = gql`
  mutation CancelPendingReservation($id: String!) {
    cancelPendingReservation(id: $id) {
      id
      statut
      numeroReservation
      missionId
      dateAnnulation
      motifAnnulation
      annulePar
    }
  }
`;