import { gql } from 'graphql-request';

export const CREATE_ORDER = gql`
  mutation CreateOrder($data: OrderInput!) {
    createOrder(data: $data) {
      data {
        id
        attributes {
          total
        }
      }
    }
  }
`;
