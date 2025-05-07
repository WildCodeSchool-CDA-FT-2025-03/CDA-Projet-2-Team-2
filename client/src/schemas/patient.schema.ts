import { gql } from '@apollo/client';

export const PATIENT_QUERY = gql`
  query GetPatientByID($patientId: Float!) {
    getPatientByID(patientId: $patientId) {
      birth_date
      city {
        id
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

export const PATIENT_UPDATE_MUTATION = gql`
  mutation UpdatePatient($patientData: PatientInput!) {
    updatePatient(patientData: $patientData) {
      adress
      birth_city
      birth_date
      contact_person
      email
      firstname
      gender
      id
      lastname
      phone_number
      private_assurance
      referring_physician
      social_number
      city {
        city
        postal_code
      }
    }
  }
`;
