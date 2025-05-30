import { describe, it, expect, beforeAll, jest, afterEach, afterAll } from '@jest/globals';
import { graphql, GraphQLSchema, print } from 'graphql';
import { gql } from 'graphql-tag';

import createSchema from '../schema';
import { User, UserRole } from '../entities/user.entity';
import { Departement } from '../entities/departement.entity';
import { generateToken } from '../utils/jwt.utils';

const loginMutation = gql`
  mutation Mutation($input: LoginInput!) {
    login(input: $input) {
      user {
        email
      }
    }
  }
`;

const createUserMutation = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      firstname
      lastname
      role
      status
      departement {
        id
        label
      }
    }
  }
`;

const meQuery = gql`
  query Me {
    me {
      id
      email
      firstname
      lastname
      role
    }
  }
`;

type LoginResponse = {
  login: {
    user: {
      email: string;
    };
  };
};

type CreateUserResponse = {
  createUser: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    status: string;
    departement: {
      id: number;
      label: string;
    };
  };
};

describe('Auth', () => {
  let schema: GraphQLSchema;
  let departementId: number;
  let adminToken: string;
  let doctorToken: string;

  beforeAll(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    schema = await createSchema();

    const departement = await Departement.findOne({ where: { label: 'Test' } });
    departementId = departement ? departement.id : 1;

    adminToken = generateToken({
      id: 1,
      email: 'test@test.com',
      role: UserRole.ADMIN,
    });

    doctorToken = generateToken({
      id: 2,
      email: 'doctor@test.com',
      role: UserRole.DOCTOR,
    });
  });

  afterEach(async () => {
    await User.delete({ email: 'newuser@test.com' });
  });

  afterAll(() => {
    jest.restoreAllMocks();
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
    expect(data.login.user).toBeDefined();
  });

  it('should create a new user with default role and status', async () => {
    const result = await graphql({
      schema,
      source: print(createUserMutation),
      variableValues: {
        input: {
          email: 'newuser@test.com',
          password: 'securepassword',
          firstname: 'New',
          lastname: 'User',
          departementId: departementId,
        },
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

    const data = result.data as unknown as CreateUserResponse;
    expect(data.createUser).toBeDefined();
    expect(data.createUser.email).toBe('newuser@test.com');
    expect(data.createUser.firstname).toBe('New');
    expect(data.createUser.lastname).toBe('User');
    expect(data.createUser.role).toBe('doctor');
    expect(data.createUser.status).toBe('pending');
    expect(Number(data.createUser.departement.id)).toBe(departementId);
  });

  it('should not create a new user with custom role and status', async () => {
    const result = await graphql({
      schema,
      source: print(createUserMutation),
      variableValues: {
        input: {
          email: 'newuser@test.com',
          password: 'securepassword',
          firstname: 'New',
          lastname: 'User',
          departementId: departementId,
          role: 'secretary',
          status: 'active',
        },
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

    const data = result.data as unknown as CreateUserResponse;
    expect(data.createUser).toBeDefined();
    expect(data.createUser.email).toBe('newuser@test.com');
    expect(data.createUser.role).toBe('secretary');
    expect(data.createUser.status).toBe('active');
  });

  it('should not create a user with an existing email', async () => {
    await graphql({
      schema,
      source: print(createUserMutation),
      variableValues: {
        input: {
          email: 'newuser@test.com',
          password: 'securepassword',
          firstname: 'New',
          lastname: 'User',
          departementId: departementId,
        },
      },
      contextValue: {
        req: {
          headers: {
            cookie: `token=${adminToken}`,
          },
        },
      },
    });

    const result = await graphql({
      schema,
      source: print(createUserMutation),
      variableValues: {
        input: {
          email: 'newuser@test.com',
          password: 'anotherpassword',
          firstname: 'Another',
          lastname: 'User',
          departementId: departementId,
        },
      },
      contextValue: {
        req: {
          headers: {
            cookie: `token=${adminToken}`,
          },
        },
      },
    });

    expect(result.errors).toBeDefined();
    expect(result.errors![0].message).toContain('User with this email already exists');
  });

  it('should not create a user with an invalid departement', async () => {
    const result = await graphql({
      schema,
      source: print(createUserMutation),
      variableValues: {
        input: {
          email: 'newuser@test.com',
          password: 'securepassword',
          firstname: 'New',
          lastname: 'User',
          departementId: 9999,
        },
      },
      contextValue: {
        req: {
          headers: {
            cookie: `token=${adminToken}`,
          },
        },
      },
    });

    expect(result.errors).toBeDefined();
    expect(result.errors![0].message).toContain('Department not found');
  });

  it('should not create a user with not admin token', async () => {
    const result = await graphql({
      schema,
      source: print(createUserMutation),
      variableValues: {
        input: {
          email: 'newuser@test.com',
          password: 'securepassword',
          firstname: 'New',
          lastname: 'User',
          departementId: departementId,
        },
      },
      contextValue: {
        req: {
          headers: {
            cookie: `token=${doctorToken}`,
          },
        },
      },
    });

    expect(result.errors).toBeDefined();
    expect(result.errors![0].message).toContain(
      "Access denied! You don't have permission for this action!",
    );
  });

  it('should return the authenticated user when a valid token is provided', async () => {
    const result = await graphql({
      schema,
      source: print(meQuery),
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

    const data = result.data as { me: { id: number; email: string; role: string } };
    expect(data.me).toBeDefined();
    expect(data.me.email).toBe('test@test.com');
    expect(data.me.role).toBe('admin');
  });

  it('should return null when no token is provided', async () => {
    const result = await graphql({
      schema,
      source: print(meQuery),
      contextValue: {
        req: {
          headers: {
            cookie: '',
          },
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    const data = result.data as { me: null };
    expect(data.me).toBeNull();
  });

  it('should return null when an invalid token is provided', async () => {
    const result = await graphql({
      schema,
      source: print(meQuery),
      contextValue: {
        req: {
          headers: {
            cookie: 'token=invalid_token',
          },
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    const data = result.data as { me: null };
    expect(data.me).toBeNull();
  });
});
