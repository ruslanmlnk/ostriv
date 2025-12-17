import { gql } from 'graphql-request'

export const GET_PRODUCTS = gql`
  query GetProducts($where: Product_where, $limit: Int = 100) {
    Products(where: $where, limit: $limit) {
      docs {
        id
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
          alt
        }
        category {
          id
          slug
          title
        }
      }
    }
  }
`
