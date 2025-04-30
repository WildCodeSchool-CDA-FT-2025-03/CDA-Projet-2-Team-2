import { buildSchema } from 'type-graphql';

import { PatientResolver } from './resolvers/patient.resolver';
import { AuthResolver } from './resolvers/auth.resolver';
import { DepartementResolver } from './resolvers/departement.resolver';
import { CityResolver } from './resolvers/city.resolver';

export default async function createSchema() {
  return await buildSchema({
    resolvers: [AuthResolver, DepartementResolver, PatientResolver, CityResolver],
  });
}
