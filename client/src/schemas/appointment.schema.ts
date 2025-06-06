import { gql } from '@apollo/client';

export const GET_LAST_APPOINTEMENTS = gql`
  query GetLastAppointmentsByPatient($patientId: String!) {
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
  query GetNextAppointmentsByPatient($patientId: String!) {
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
  query GetDoctorByPatient($patientId: String!) {
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

export const GET_DOCTOR_SLOT_BY_DPT = gql`
  query GetDoctorSlotByDepartement($date: String!, $departementId: Float!) {
    getDoctorSlotByDepartement(date: $date, departement_id: $departementId) {
      id
      debut_libre
      fin_libre
      firstname
      jour
      lastname
      user_id
    }
  }
`;

export const MUTATION_CREATE_APPOINTMENT = gql`
  mutation createAppointment($appointmentInput: AppointmentCreateInput!) {
    createAppointment(appointmentInput: $appointmentInput) {
      id
    }
  }
`;
