import { gql } from '@apollo/client';

export const GET_HELLO_WORLD = gql`
  query GetHelloById($getHelloByIdId: Float!) {
    getHelloById(id: $getHelloByIdId) {
      message
    }
  }
`;
