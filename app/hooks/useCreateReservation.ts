// hooks/useCreateReservation.ts
import type { CreateReservationInput } from '@/app/types/reservations-mission';
import type { Reservation } from '@/app/types/reservation';
import { useMutation } from '@apollo/client/react';
import { CREATE_RESERVATION } from '@/lib/graphql/mutations/reservation.mutations';

// ✅ Nouveau type de réponse
interface ReservationResponse {
  success: boolean;
  message: string;
  code?: string;
  reservation?: Reservation;
}

// ✅ Type de retour de la mutation
interface CreateReservationData {
  createReservation: ReservationResponse; // ✅ Changé ici
}

interface CreateReservationVariables {
  input: CreateReservationInput;
}

export function useCreateReservation() {
  const [mutate, { data, loading, error }] = useMutation<
    CreateReservationData,
    CreateReservationVariables
  >(CREATE_RESERVATION, {
    onCompleted: (data) => {
      const response = data.createReservation;
      
      if (response.success) {
        console.log('✅ Réservation créée avec succès:', response.reservation);
      } else {
        console.warn('⚠️ Réservation non créée:', response.message, response.code);
      }
    },
    onError: (error: any) => {
      console.error('❌ Erreur mutation GraphQL:', error);
      if (error.graphQLErrors) {
        console.error('❌ GraphQL Errors:', error.graphQLErrors);
      }
      if (error.networkError) {
        console.error('❌ Network Error:', error.networkError);
      }
    },
  });

  const createReservation = async (
    input: CreateReservationInput
  ): Promise<ReservationResponse> => { // ✅ Retourne ReservationResponse
    console.log('🔧 createReservation appelé avec:', input);
    
    try {
      const result = await mutate({
        variables: { input },
      });
      
      console.log('✅ Résultat mutation:', result);
      
      const response = result.data?.createReservation;
      
      if (!response) {
        // Cas improbable mais géré
        return {
          success: false,
          message: 'Aucune réponse reçue du serveur',
          code: 'NO_RESPONSE',
        };
      }
      
      return response;
      
    } catch (err: any) {
      console.error('❌ Erreur lors de la création:', err);
      console.error('❌ Message:', err.message);
      
      if (err.graphQLErrors) {
        console.error('❌ GraphQL Errors:', err.graphQLErrors);
      }
      if (err.networkError) {
        console.error('❌ Network Error:', err.networkError);
      }
      
      // ✅ Retourner une réponse d'erreur au lieu de throw
      return {
        success: false,
        message: err.message || 'Erreur lors de la réservation',
        code: 'GRAPHQL_ERROR',
      };
    }
  };

  return {
    createReservation,
    response: data?.createReservation, // ✅ Renommé en "response"
    reservation: data?.createReservation?.reservation, // ✅ Accès direct à la réservation
    loading,
    error,
  };
}
