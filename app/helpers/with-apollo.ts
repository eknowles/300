import { HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { useMemo } from 'react';

let apolloClient;

function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: `${process.env.ROOT_DOMAIN}/api/graphql`, // Server URL (must be absolute)
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    }),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
