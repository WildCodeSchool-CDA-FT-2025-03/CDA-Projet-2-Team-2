import { gql } from '@apollo/client';

export const GET_LAST_APPOINTEMENTS = gql`
  query GetLastAppointmentsByPatient($patientId: Float!) {
    getLastAppointmentsByPatient(patientId: $patientId) {
      id
      doctor {
        departement {
          label
        }
        firstname
        lastname
      }
      start_time
    }
  }
`;

export const GET_NEXT_APPOINTEMENTS = gql`
  query GetNextAppointmentsByPatient($patientId: Float!) {
    getNextAppointmentsByPatient(patientId: $patientId) {
      id
      doctor {
        departement {
          label
        }
        firstname
        lastname
      }
      start_time
    }
  }
`;
