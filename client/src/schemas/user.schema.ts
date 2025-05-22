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

export const SEARCH_DOCTORS = gql`
  query SearchDoctors($query: String!) {
    searchDoctors(query: $query) {
      id
      firstname
      lastname
      profession
      departement
    }
  }
`;
