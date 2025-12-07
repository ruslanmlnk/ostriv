import { GraphQLClient } from 'graphql-request';

// Base URL for Strapi; adjust via env if needed.
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://46.175.148.52:1337';
export const GRAPHQL_URL = `${STRAPI_URL}/graphql`;

export const graphqlClient = new GraphQLClient(GRAPHQL_URL);
