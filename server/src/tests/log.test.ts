import { describe, it, expect, beforeAll } from '@jest/globals';
import { graphql, GraphQLSchema, print } from 'graphql';
import { gql } from 'graphql-tag';

import createSchema from '../schema';
import { Log } from '../entities/log.entity';
import { User, UserRole } from '../entities/user.entity';
import { generateToken } from '../utils/jwt.utils';
import { LogMetadata, LogsResponse } from '../types/log.type';

const GET_LOGS_QUERY = gql`
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

const GET_LOG_BY_ID_QUERY = gql`
  query GetLogById($id: String!) {
    getLogById(id: $id) {
      id
      titre
      metadata
      createAt
    }
  }
`;

describe('LogResolver', () => {
  let schema: GraphQLSchema;
  let adminToken: string;
  let doctorToken: string;
  let testLogIds: string[] = [];

  beforeAll(async () => {
    schema = await createSchema();

    const adminUser = await User.findOne({ where: { role: UserRole.ADMIN } });

    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    adminToken = generateToken(adminUser);

    doctorToken = generateToken({
      id: 2,
      email: 'doctor@test.com',
      role: UserRole.DOCTOR,
    });

    const testLogs: { titre: string; metadata: LogMetadata }[] = [
      {
        titre: 'User Login',
        metadata: { userId: 1, email: 'test@test.com', action: 'login' },
      },
      {
        titre: 'User Created',
        metadata: { userId: 3, email: 'new@test.com', role: 'doctor' },
      },
      {
        titre: 'Department Created',
        metadata: { departmentId: 1, label: 'Cardiology' },
      },
      {
        titre: 'Patient Updated',
        metadata: { patientId: 1, action: 'update', fieldsList: 'email,phone' },
      },
      {
        titre: 'System Error',
        metadata: { module: 'auth', messageText: 'Invalid token', code: 401 },
      },
    ];

    for (const logData of testLogs) {
      const log = new Log();
      log.titre = logData.titre;
      log.metadata = logData.metadata;
      await log.save();
      testLogIds.push(log.id);
    }
  });

  it('should return all logs for admin', async () => {
    const result = await graphql({
      schema,
      source: print(GET_LOGS_QUERY),
      contextValue: {
        req: {
          headers: {
            cookie: `token=${adminToken}`,
          },
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    const data = result.data as { getLogs: LogsResponse };
    expect(data.getLogs).toBeDefined();
    expect(data.getLogs.logs.length).toBeGreaterThanOrEqual(5);
    expect(data.getLogs.total).toBeGreaterThanOrEqual(5);
  });

  it('should not allow non-admin users to access logs', async () => {
    const result = await graphql({
      schema,
      source: print(GET_LOGS_QUERY),
      contextValue: {
        req: {
          headers: {
            cookie: `token=${doctorToken}`,
          },
        },
      },
    });

    expect(result.errors).toBeDefined();
    expect(result.errors![0].message).toContain('Access denied');
  });

  it('should paginate logs correctly', async () => {
    const result = await graphql({
      schema,
      source: print(GET_LOGS_QUERY),
      variableValues: {
        limit: 2,
        offset: 0,
      },
      contextValue: {
        req: {
          headers: {
            cookie: `token=${adminToken}`,
          },
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    const data = result.data as { getLogs: LogsResponse };
    expect(data.getLogs.logs.length).toBe(2);
    expect(data.getLogs.total).toBeGreaterThanOrEqual(5);

    const secondPageResult = await graphql({
      schema,
      source: print(GET_LOGS_QUERY),
      variableValues: {
        limit: 2,
        offset: 2,
      },
      contextValue: {
        req: {
          headers: {
            cookie: `token=${adminToken}`,
          },
        },
      },
    });

    expect(secondPageResult.errors).toBeUndefined();
    const secondPageData = secondPageResult.data as { getLogs: LogsResponse };
    expect(secondPageData.getLogs.logs.length).toBe(2);

    const firstPageIds = data.getLogs.logs.map((log) => log.id);
    const secondPageIds = secondPageData.getLogs.logs.map((log) => log.id);

    expect(firstPageIds).not.toEqual(secondPageIds);
  });

  it('should filter logs by search term', async () => {
    const result = await graphql({
      schema,
      source: print(GET_LOGS_QUERY),
      variableValues: {
        search: 'User',
      },
      contextValue: {
        req: {
          headers: {
            cookie: `token=${adminToken}`,
          },
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    const data = result.data as { getLogs: LogsResponse };
    expect(data.getLogs.logs.length).toBeGreaterThanOrEqual(2);

    data.getLogs.logs.forEach((log) => {
      expect(log.titre.toLowerCase()).toContain('user');
    });
  });

  it('should retrieve a specific log by ID', async () => {
    const testLogId = testLogIds[0];

    const result = await graphql({
      schema,
      source: print(GET_LOG_BY_ID_QUERY),
      variableValues: {
        id: testLogId,
      },
      contextValue: {
        req: {
          headers: {
            cookie: `token=${adminToken}`,
          },
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    const data = result.data as { getLogById: Log | null };
    expect(data.getLogById).toBeDefined();
    expect(data.getLogById!.id).toBe(testLogId);
    expect(data.getLogById!.titre).toBe('User Login');
    expect(data.getLogById!.metadata).toEqual({
      userId: 1,
      email: 'test@test.com',
      action: 'login',
    });
  });

  it('should return null for a non-existent log ID', async () => {
    const result = await graphql({
      schema,
      source: print(GET_LOG_BY_ID_QUERY),
      variableValues: {
        id: '00000000-0000-0000-0000-000000000000',
      },
      contextValue: {
        req: {
          headers: {
            cookie: `token=${adminToken}`,
          },
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    const data = result.data as { getLogById: Log | null };
    expect(data.getLogById).toBeNull();
  });
});
