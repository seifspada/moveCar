// hooks/useSearchMissions.ts
import { 
  SEARCH_MISSIONS, 
  SEARCH_MISSIONS_BY_POSITION, 
  SEARCH_MISSIONS_BY_TRAJET 
} from '@/lib/graphql/queries/mission-card';
import { MissionDetails } from '@/app/types/mission';
import { useLazyQuery, useQuery } from '@apollo/client/react';

interface MissionsPaginatedResponse {
  missions: MissionDetails[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface SearchMissionsData {
  searchMissions: MissionsPaginatedResponse;
}

interface SearchMissionsByPositionData {
  searchMissionsByPosition: MissionsPaginatedResponse;
}

interface SearchMissionsByTrajetData {
  searchMissionsByTrajet: MissionsPaginatedResponse;
}

interface SearchMissionsVariables {
  search?: string;
  page?: number;
  pageSize?: number;
}

interface SearchByPositionVariables {
  filters: {
    villeNom: string;
    latitude: number;
    longitude: number;
    rayon: number;
  };
  page?: number;
  pageSize?: number;
}

interface SearchByTrajetVariables {
  filters: {
    villeDepartNom: string;
    latitudeDepart: number;
    longitudeDepart: number;
    villeArriveeNom: string;
    latitudeArrivee: number;
    longitudeArrivee: number;
    rayon: number;
    dateDepart?: string;
    dateDepartMax?: string;
  };
  page?: number;
  pageSize?: number;
}

/**
 * ✅ Hook principal : Recherche par texte
 */
export function useSearchMissions(search?: string, page = 1, pageSize = 20) {
  const { data, loading, error, refetch } = useQuery<SearchMissionsData, SearchMissionsVariables>(
    SEARCH_MISSIONS,
    {
      variables: { search, page, pageSize },
      fetchPolicy: 'network-only',
    }
  );

  return {
    missions: data?.searchMissions.missions || [],
    total: data?.searchMissions.total || 0,
    page: data?.searchMissions.page || 1,
    pageSize: data?.searchMissions.pageSize || 20,
    totalPages: data?.searchMissions.totalPages || 0,
    loading,
    error,
    refetch,
  };
}

/**
 * ✅ Hook : Recherche par position géographique (lazy)
 */
export function useSearchMissionsByPosition() {
  const [searchByPosition, { data, loading, error }] = useLazyQuery<
    SearchMissionsByPositionData,
    SearchByPositionVariables
  >(SEARCH_MISSIONS_BY_POSITION, {
    fetchPolicy: 'network-only',
  });

  const search = async (
    villeNom: string,
    latitude: number,
    longitude: number,
    rayon: number,
    page = 1,
    pageSize = 20
  ) => {
    return searchByPosition({
      variables: {
        filters: { villeNom, latitude, longitude, rayon },
        page,
        pageSize,
      },
    });
  };

  return {
    search,
    missions: data?.searchMissionsByPosition.missions || [],
    total: data?.searchMissionsByPosition.total || 0,
    page: data?.searchMissionsByPosition.page || 1,
    pageSize: data?.searchMissionsByPosition.pageSize || 20,
    totalPages: data?.searchMissionsByPosition.totalPages || 0,
    loading,
    error,
  };
}

/**
 * ✅ Hook : Recherche par trajet (lazy)
 */
export function useSearchMissionsByTrajet() {
  const [searchByTrajet, { data, loading, error }] = useLazyQuery<
    SearchMissionsByTrajetData,
    SearchByTrajetVariables
  >(SEARCH_MISSIONS_BY_TRAJET, {
    fetchPolicy: 'network-only',
  });

  const search = async (
    filters: {
      villeDepartNom: string;
      latitudeDepart: number;
      longitudeDepart: number;
      villeArriveeNom: string;
      latitudeArrivee: number;
      longitudeArrivee: number;
      rayon: number;
      dateDepart?: string;
      dateDepartMax?: string;
    },
    page = 1,
    pageSize = 20
  ) => {
    return searchByTrajet({
      variables: {
        filters,
        page,
        pageSize,
      },
    });
  };

  return {
    search,
    missions: data?.searchMissionsByTrajet.missions || [],
    total: data?.searchMissionsByTrajet.total || 0,
    page: data?.searchMissionsByTrajet.page || 1,
    pageSize: data?.searchMissionsByTrajet.pageSize || 20,
    totalPages: data?.searchMissionsByTrajet.totalPages || 0,
    loading,
    error,
  };
}
