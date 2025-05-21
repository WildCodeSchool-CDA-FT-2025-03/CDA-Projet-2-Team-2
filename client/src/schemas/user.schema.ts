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
      activationDate
      gender
      tel
      profession
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
      activationDate
      gender
      tel
      profession
    }
  }
`;

export const GET_DOCTORS_BY_DEPARTEMENT = gql`
  query GetDoctorsByDepartement($label: String!) {
    getDoctorsByDepartement(label: $label) {
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
