import { User } from '@/types/graphql-generated';
import { createMockDepartement } from './createMockDepartement';

type CreateMockUserProps = {
  id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  role: 'SECRETARY' | 'DOCTOR' | 'ADMIN'; // 👈 required
  status?: 'ACTIVE' | 'INACTIVE';
};

export function createMockUser({
  id = 'user-1',
  email = 'mock@example.com',
  firstname = 'Mocky',
  lastname = 'User',
  role,
  status = 'ACTIVE',
}: CreateMockUserProps): User {
  return {
    id,
    email,
    firstname,
    lastname,
    role,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    departement: createMockDepartement(),
    __typename: 'User',
  };
}
