import { gql } from '@apollo/client';

export const CITY_QUERY_BYCP = gql`
  query GetCityByCP($postalCode: String!) {
    getCityByCP(postal_code: $postalCode) {
      id
      city
      postal_code
    }
  }
`;
