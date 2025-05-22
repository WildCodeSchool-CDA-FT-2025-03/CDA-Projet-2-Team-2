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

export const GET_USER_BY_MAIL = gql`
  mutation SendResetPassword($email: String!) {
    sendResetPassword(email: $email)
  }
`;
