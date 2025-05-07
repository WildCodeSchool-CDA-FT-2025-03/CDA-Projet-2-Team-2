import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      email
      role
      firstname
      lastname
      status
      departement {
        label
      }
    }
  }
`;
