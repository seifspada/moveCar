// components/providers/ApolloProviderWrapper.tsx
'use client';

import { apolloClient } from '@/lib/apollo-client'; // ✅ Avec accolades
import { ApolloProvider } from '@apollo/client/react';

export function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
