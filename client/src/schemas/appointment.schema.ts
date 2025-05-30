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

export const GET_DOCTOR_BY_PATIENT = gql`
  query GetDoctorByPatient($patientId: Float!) {
    getDoctorByPatient(patientId: $patientId) {
      doctor {
        id
        firstname
        lastname
        departement {
          label
        }
      }
    }
  }
`;

export const GET_APPOINTMENTS_BY_DOCTOR_AND_DATE = gql`
  query GetAppointmentsByDoctorAndDate($doctorId: Float!, $date: String!) {
    getAppointmentsByDoctorAndDate(doctorId: $doctorId, date: $date) {
      id
      start_time
      duration
      status
      patient {
        id
        firstname
        lastname
      }
      doctor {
        id
        firstname
        lastname
      }
      appointmentType {
        id
        reason
      }
      departement {
        id
        label
      }
    }
  }
`;
