// hooks/useMissionDetails.ts
import { useParams } from 'next/navigation';
import { MissionDetail } from '@/app/types/mission';
import { useQuery } from '@apollo/client/react';
import { GET_MISSION_BY_ID } from '@/lib/graphql/queries/mission-detail';

// ✅ Définir le type de la réponse GraphQL
interface GetMissionByIdResponse {
  getMissionById: MissionDetail;
}

export function useMissionDetails() {
  const params = useParams<{ id: string }>();
  const missionId = params?.id;

  // ✅ Typer useQuery avec le generic <GetMissionByIdResponse>
  const { data, loading, error, refetch } = useQuery<GetMissionByIdResponse>(
    GET_MISSION_BY_ID, 
    {
      variables: { id: missionId },
      skip: !missionId,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    mission: data?.getMissionById ?? null,  // ✅ Plus d'erreur TypeScript
    loading,
    error,
    refetch,
  };
}
