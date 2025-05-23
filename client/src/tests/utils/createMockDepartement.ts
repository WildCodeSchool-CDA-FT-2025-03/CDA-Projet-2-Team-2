import { Departement } from '@/types/graphql-generated';

type CreateMockDepartementProps = {
  id?: string;
  name?: string;
  label?: string;
  level?: string;
  building?: string;
  status?: 'ACTIVE' | 'INACTIVE';
};

export function createMockDepartement({
  id = 'dep-1',
  label = 'Département test',
  level = '1',
  building = 'Bâtiment A',
  status = 'ACTIVE',
}: CreateMockDepartementProps = {}): Departement {
  return {
    id,
    label,
    level,
    building,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: [],
    wing: 'wing-1',
    __typename: 'Departement',
  };
}
