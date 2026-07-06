// src/hooks/useMissionCurrentLocation.ts

import { QueryHookOptions, useQuery } from "@apollo/client/react";
import { GetMissionCurrentLocationData, GetMissionCurrentLocationVars } from "../types/mission-tracking.type";
import { GET_MISSION_CURRENT_LOCATION } from "@/lib/graphql/queries/mission-tracking.queries";

interface UseMissionCurrentLocationOptions {
  pollInterval?: number; // en ms, ex: 10000 pour 10s
  skip?: boolean;
}

export function useMissionCurrentLocation(
  missionId: string,
  options?: UseMissionCurrentLocationOptions,
) {
  const queryOptions: QueryHookOptions<
    GetMissionCurrentLocationData,
    GetMissionCurrentLocationVars
  > = {
    variables: { missionId },
    pollInterval: options?.pollInterval ?? 10000, // refresh auto toutes les 10s par défaut
    skip: options?.skip || !missionId,
    fetchPolicy: 'network-only', // toujours avoir la position fraîche, pas le cache
  };

  const { data, loading, error, refetch } = useQuery<
    GetMissionCurrentLocationData,
    GetMissionCurrentLocationVars
  >(GET_MISSION_CURRENT_LOCATION, queryOptions);

  return {
    location: data?.getMissionCurrentLocation ?? null,
    loading,
    error,
    refetch,
  };
}