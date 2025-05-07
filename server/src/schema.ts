import { buildSchema } from 'type-graphql';

import { PatientResolver } from './resolvers/patient.resolver';
import { AuthResolver } from './resolvers/auth.resolver';
import { DepartementResolver } from './resolvers/departement.resolver';
import { CityResolver } from './resolvers/city.resolver';
import { getUserFromToken } from './utils/jwt.utils';
import { AppointmentResolver } from './resolvers/appointment.resolver';

export default async function createSchema() {
  return await buildSchema({
    resolvers: [
      AuthResolver,
      DepartementResolver,
      PatientResolver,
      CityResolver,
      AppointmentResolver,
    ],
    authChecker: async ({ context }, roles) => {
      const user = await getUserFromToken(context.req.headers.cookie);

      if (roles.length === 0) return !!user;

      if (!user) return false;

      return roles.includes(user.role);
    },
  });
}
