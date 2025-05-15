import { gql } from '@apollo/client';

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
