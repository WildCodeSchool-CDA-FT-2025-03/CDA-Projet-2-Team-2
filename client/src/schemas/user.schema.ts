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
        id
        label
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      role
      departement {
        label
        id
      }
      firstname
      lastname
      status
    }
  }
`;
