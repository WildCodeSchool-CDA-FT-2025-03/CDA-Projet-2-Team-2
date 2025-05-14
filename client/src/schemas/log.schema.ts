import { gql } from '@apollo/client';

export const GET_LOGS = gql`
  query GetLogs($limit: Int, $offset: Int, $search: String) {
    getLogs(limit: $limit, offset: $offset, search: $search) {
      logs {
        id
        titre
        metadata
        createAt
      }
      total
    }
  }
`;

export const GET_LOG_BY_ID = gql`
  query GetLogById($id: String!) {
    getLogById(id: $id) {
      id
      titre
      metadata
      createAt
    }
  }
`;
