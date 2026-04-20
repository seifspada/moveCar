// lib/apollo-client.ts
'use client';

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin',
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          reservationsByMission: {
            merge(_, incoming) {
              return incoming;
            },
          },
          allReservations: {
            merge(_, incoming) {
              return incoming;
            },
          },
          myReservations: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
      ReservationMissionEntity: {
        keyFields: ['id'],
      },
    },
  }),
  ssrMode: typeof window === 'undefined',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',      // ✅ FIX: réseau à chaque render
      nextFetchPolicy: 'network-only',  // ✅ FIX: réseau aussi après refetch
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});