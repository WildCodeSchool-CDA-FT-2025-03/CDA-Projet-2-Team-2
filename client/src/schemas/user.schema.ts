import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetAllUsers($page: Int, $limit: Int, $search: String) {
    getAllUsers(page: $page, limit: $limit, search: $search) {
      users {
        id
        email
        role
        firstname
        lastname
        status
        activationDate
        gender
        tel
        departement {
          id
          label
        }
      }
      total
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
      departement {
        id
        label
      }
    }
  }
`;

export const SEND_RESET_PASSWORD_BY_MAIL = gql`
  mutation SendResetPassword($email: sendEmailInput!) {
    sendResetPassword(email: $email)
  }
`;

export const UPDATE_USER_STATUS = gql`
  mutation ChangeStatusStatus($changeStatusStatusId: String!) {
    changeStatusStatus(id: $changeStatusStatusId)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;
