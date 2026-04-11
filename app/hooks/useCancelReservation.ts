// hooks/useCancelReservation.ts
import { CANCEL_RESERVATION } from '@/lib/graphql/mutations/reservation.mutations';
import { useMutation } from '@apollo/client/react';

// ✅ Ajouter les interfaces de typage
interface CancelReservationResponse {
  id: string;
  numeroReservation: string;
  statut: string;
}

interface CancelReservationData {
  cancelReservation: CancelReservationResponse;
}

interface CancelReservationVariables {
  id: string;
}

export function useCancelReservation() {
  const [mutate, { loading, error }] = useMutation<
    CancelReservationData,
    CancelReservationVariables
  >(CANCEL_RESERVATION, {
    onCompleted: (data) => {
      console.log('✅ Réservation annulée:', data.cancelReservation.numeroReservation);
    },
    onError: (error) => {
      console.error('❌ Erreur annulation:', error.message);
    },
  });

  const cancelReservation = async (id: string): Promise<boolean> => {
    try {
      await mutate({ variables: { id } });
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    cancelReservation,
    loading,
    error,
  };
}
