import argon2 from 'argon2';
import { Departement, DepartementStatus } from '../entities/departement.entity';
import { User, UserRole } from '../entities/user.entity';

export async function seedTestDatabase() {
  await User.delete({});
  await Departement.delete({});

  const departement = await Departement.create({
    label: 'Test',
    building: 'Test',
    wing: 'Test',
    level: 'Test',
    status: DepartementStatus.ACTIVE,
  }).save();

  const hash = await argon2.hash('password');

  await User.create({
    email: 'test@test.com',
    password: hash,
    firstname: 'Test',
    lastname: 'Test',
    departement: departement,
    role: UserRole.ADMIN,
  }).save();

  await User.create({
    email: 'doctor@test.com',
    password: hash,
    firstname: 'Doctor',
    lastname: 'Test',
    departement: departement,
    role: UserRole.DOCTOR,
  }).save();
}

if (require.main === module) {
  (async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { dataSource } = require('./client');
    try {
      await dataSource.initialize();
      await seedTestDatabase();
      console.info('Test database seeded successfully');
      process.exit(0);
    } catch (error) {
      console.error('Failed to seed test database:', error);
      process.exit(1);
    }
  })();
}
