// hooks/useMissions.ts
import { GET_MISSIONS_FOR_CARDS } from '@/lib/graphql/queries/mission-card';
import { MissionDetails } from '@/app/types/mission';
import { useQuery } from '@apollo/client/react';

interface MissionsData {
  missionsForCards: MissionDetails[];
}

export function useMissions() {
  const { data, loading, error, refetch } = useQuery<MissionsData>(
    GET_MISSIONS_FOR_CARDS,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    missions: data?.missionsForCards || [],
    loading,
    error,
    refetch,
  };
}
