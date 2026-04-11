// hooks/useMissionsByAgence.ts
import { GET_MISSIONS_BY_AGENCE } from '@/lib/graphql/queries/mission-card';
import { MissionDetails } from '@/app/types/mission';
import { useQuery } from '@apollo/client/react';

// ✅ Définir le type de la réponse GraphQL
interface GetMissionsByAgenceResponse {
  getMissionsByAgence: MissionDetails[];
}

export function useMissionsByAgence(agenceId: number) {
  const { data, loading, error, refetch } = useQuery<GetMissionsByAgenceResponse>(
    GET_MISSIONS_BY_AGENCE,
    {
      variables: { agenceId },
      skip: !agenceId,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    missions: data?.getMissionsByAgence ?? [],  // ✅ tableau vide par défaut
    loading,
    error,
    refetch,
  };
}