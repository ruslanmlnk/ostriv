import { gql } from 'graphql-request';

export const GET_PRODUCTS = gql`
  query GetProducts($filters: ProductFiltersInput, $sort: [String]) {
    products(filters: $filters, sort: $sort, pagination: { limit: 100 }) {
      slug
      name
      price
      oldPrice
      rating
      description
      isHit
      isNew
      discount
      image {
        url
        width
        height
        alternativeText
      }
      category {
        slug
      }
    }
  }
`;
