import { buildSchema } from 'type-graphql';

import { PatientResolver } from './resolvers/patient.resolver';
import { AuthResolver } from './resolvers/auth.resolver';
import { DepartementResolver } from './resolvers/departement.resolver';
import { CityResolver } from './resolvers/city.resolver';

export default async function createSchema() {
  return await buildSchema({
    resolvers: [AuthResolver, DepartementResolver, PatientResolver, CityResolver],
    authChecker: async ({ context }, roles) => {
      if (roles.length === 0) {
        return !!context.user;
      }

      if (!context.user) {
        console.error(
          'User not found. try to check if you use the AuthMiddleware above the resolver !',
        );
        return false;
      }

      return roles.includes(context.user.role);
    },
  });
}
