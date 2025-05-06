import { gql } from '@apollo/client';

export const DEPARTMENT = gql`
  query GetDepartements {
    getDepartements {
      id
      label
      building
      wing
      level
      status
    }
  }
`;

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartement($data: DepartementInput!) {
    createDepartement(data: $data)
  }
`