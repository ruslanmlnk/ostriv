import { gql } from 'graphql-request';

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      title
      slug
      image {
        url
        width
        height
        alternativeText
      }
    }
  }
`;
