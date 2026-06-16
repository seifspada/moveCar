// app/hooks/useActiveMissionsMap.ts
"use client";
import { GET_ACTIVE_MISSIONS_MAP } from "@/lib/graphql/queries/map-agent";
import { ActiveMission } from "../types/map-agent";
import { useQuery } from "@apollo/client/react";

export function useActiveMissionsMap(pollIntervalMs = 15000) {
  const { data, loading, error, refetch, previousData } = useQuery<{
    getActiveMissionsMap: ActiveMission[];
  }>(GET_ACTIVE_MISSIONS_MAP, {
    pollInterval: pollIntervalMs,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const missions =
    data?.getActiveMissionsMap ??
    previousData?.getActiveMissionsMap ??
    [];

  return {
    missions,
    loading: loading && missions.length === 0,
    error: error?.message ?? null,
    refetch,
  };
}