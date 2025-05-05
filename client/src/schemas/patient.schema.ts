import { gql } from '@apollo/client';

export const PATIENT_QUERY = gql`
  query GetPatientByID($patientId: Float!) {
    getPatientByID(patientId: $patientId) {
      birth_date
      city {
        city
        postal_code
      }
      email
      firstname
      gender
      id
      lastname
      note
      phone_number
      private_assurance
      social_number
      birth_city
      adress
      referring_physician
      contact_person
    }
  }
`;
