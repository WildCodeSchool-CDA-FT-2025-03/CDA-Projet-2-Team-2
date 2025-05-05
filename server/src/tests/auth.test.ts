import { describe, it, expect, beforeAll, jest } from '@jest/globals';
import { graphql, GraphQLSchema, print } from 'graphql';
import createSchema from '../schema';
import { gql } from 'graphql-tag';

const loginMutation = gql`
  mutation Mutation($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        email
      }
    }
  }
`;

type LoginResponse = {
  login: {
    token: string;
    user: {
      email: string;
    };
  };
};

describe('Auth', () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    schema = await createSchema();
  });

  it('should be able to login', async () => {
    const result = await graphql({
      schema,
      source: print(loginMutation),
      variableValues: {
        input: {
          email: 'test@test.com',
          password: 'password',
        },
      },
      contextValue: {
        res: {
          setHeader: jest.fn(),
        },
      },
    });

    expect(result.data).toBeDefined();
    expect(result.errors).toBeUndefined();

    const data = result.data as unknown as LoginResponse;

    expect(data.login).toBeDefined();
    expect(data.login.token).toBeDefined();
    expect(data.login.user).toBeDefined();
  });
});
