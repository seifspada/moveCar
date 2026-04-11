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
    }
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all', // ✅ AJOUTEZ CECI - Continue même si une query échoue
    },
    query: {
      errorPolicy: 'all', // ✅ AJOUTEZ CECI - Continue même si une query échoue
    },
    mutate: {
      errorPolicy: 'all', // ✅ AJOUTEZ CECI - Continue même si une mutation échoue
    },
  },
});
