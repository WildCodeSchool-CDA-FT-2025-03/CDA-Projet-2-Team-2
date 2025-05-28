import { gql } from '@apollo/client';

export const GET_UPCOMING_APPOINTMENTS = gql`
  query GetUpcomingAppointmentsByPatientAndDepartment($input: AppointmentInput!) {
    getUpcomingAppointmentsByPatientAndDepartment(input: $input) {
      id
      start_time
      status
      patient {
        firstname
        lastname
        social_number
      }
      doctor {
        firstname
        lastname
      }
      departement {
        id
        label
      }
      appointmentType {
        id
        reason
      }
    }
  }
`;
