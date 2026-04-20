// src/hooks/useReservations.ts
import {
  ACCEPT_CANCELLATION_REQUEST,
  ACCEPT_RESERVATION,
  CANCEL_PENDING_RESERVATION,
  CANCEL_RESERVATION,
  CONFIRM_RESERVATION_BY_ADHERENT,
  CREATE_RESERVATION,
  GET_ALL_RESERVATIONS,
  GET_MY_RESERVATIONS,
  GET_RESERVATION_BY_ID,
  GET_RESERVATIONS_BY_MISSION,
  REFUSE_CANCELLATION_REQUEST,
  REFUSE_RESERVATION,
  REQUEST_CANCELLATION,
} from '@/lib/graphql/queries/reservation.queries';

import { useMutation, useQuery } from '@apollo/client/react';
import {
  AcceptCancellationRequestResponse,
  AcceptReservationResponse,
  CancelPendingReservationResponse,
  CancelReservationResponse,
  ConfirmReservationByAdherentResponse,
  CreateReservationResponse,
  RefuseCancellationRequestResponse,
  RefuseReservationResponse,
  RequestCancellationResponse,
  ReservationsByMissionResponse,
} from '@/app/types/reservation';

// ─────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────

export const useReservationsByMission = (missionId: string) =>
  useQuery<ReservationsByMissionResponse>(GET_RESERVATIONS_BY_MISSION, {
    variables: { missionId },
    skip: !missionId,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  });

export const useMyReservations = () =>
  useQuery(GET_MY_RESERVATIONS, { fetchPolicy: 'cache-and-network' });

export const useAllReservations = () =>
  useQuery(GET_ALL_RESERVATIONS, { fetchPolicy: 'cache-and-network' });

export const useReservationById = (id: string) =>
  useQuery(GET_RESERVATION_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

// ─────────────────────────────────────────────
// MUTATIONS — ADHÉRENT
// ─────────────────────────────────────────────

export const useCreateReservation = () =>
  useMutation<CreateReservationResponse>(CREATE_RESERVATION, {
    refetchQueries: [{ query: GET_MY_RESERVATIONS }],
  });

export const useCancelReservation = () =>
  useMutation<CancelReservationResponse>(CANCEL_RESERVATION, {
    refetchQueries: (result) => [
      { query: GET_MY_RESERVATIONS },
      { query: GET_ALL_RESERVATIONS },
      {
        query: GET_RESERVATIONS_BY_MISSION,
        variables: { missionId: result.data?.cancelReservation?.missionId },
      },
    ],
  });

export const useConfirmReservationByAdherent = () =>
  useMutation<ConfirmReservationByAdherentResponse>(CONFIRM_RESERVATION_BY_ADHERENT, {
    refetchQueries: (result) => [
      { query: GET_MY_RESERVATIONS },
      { query: GET_ALL_RESERVATIONS },
      {
        query: GET_RESERVATIONS_BY_MISSION,
        variables: { missionId: result.data?.confirmReservationByAdherent?.missionId },
      },
    ],
  });

export const useRequestCancellation = () =>
  useMutation<RequestCancellationResponse>(REQUEST_CANCELLATION, {
    refetchQueries: (result) => [
      { query: GET_MY_RESERVATIONS },
      { query: GET_ALL_RESERVATIONS },
      {
        query: GET_RESERVATIONS_BY_MISSION,
        variables: { missionId: result.data?.requestCancellation?.missionId },
      },
    ],
  });

// ─────────────────────────────────────────────
// MUTATIONS — AGENT
// ─────────────────────────────────────────────

export const useAcceptReservation = () =>
  useMutation<AcceptReservationResponse>(ACCEPT_RESERVATION, {
    refetchQueries: (result) => [
      { query: GET_ALL_RESERVATIONS },
      {
        query: GET_RESERVATIONS_BY_MISSION,
        variables: { missionId: result.data?.acceptReservation?.missionId },
      },
    ],
  });

export const useRefuseReservation = () =>
  useMutation<RefuseReservationResponse>(REFUSE_RESERVATION, {
    refetchQueries: (result) => [
      { query: GET_ALL_RESERVATIONS },
      {
        query: GET_RESERVATIONS_BY_MISSION,
        variables: { missionId: result.data?.refuseReservation?.missionId },
      },
    ],
  });

export const useAcceptCancellationRequest = () =>
  useMutation<AcceptCancellationRequestResponse>(ACCEPT_CANCELLATION_REQUEST, {
    refetchQueries: (result) => [
      { query: GET_ALL_RESERVATIONS },
      {
        query: GET_RESERVATIONS_BY_MISSION,
        variables: { missionId: result.data?.acceptCancellationRequest?.missionId },
      },
    ],
  });

export const useRefuseCancellationRequest = () =>
  useMutation<RefuseCancellationRequestResponse>(REFUSE_CANCELLATION_REQUEST, {
    refetchQueries: (result) => [
      { query: GET_ALL_RESERVATIONS },
      {
        query: GET_RESERVATIONS_BY_MISSION,
        variables: { missionId: result.data?.refuseCancellationRequest?.missionId },
      },
    ],
  });


  export const useCancelPendingReservation = () =>
  useMutation<CancelPendingReservationResponse>(CANCEL_PENDING_RESERVATION, {
    refetchQueries: (result) => [
      { query: GET_MY_RESERVATIONS },
      {
        query: GET_RESERVATIONS_BY_MISSION,
        variables: {
          missionId: result.data?.cancelPendingReservation?.missionId,
        },
      },
    ],
  });