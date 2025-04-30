import argon2 from 'argon2';
import { beforeAll, afterAll } from '@jest/globals';

import { dataSource } from './src/database/client';
import { Departement } from './src/entities/departement.entity';
import { User } from './src/entities/user.entity';

beforeAll(async () => {
  try {
    await dataSource.initialize();

    const departement = await Departement.insert({
      label: 'Test',
    });

    const hash = await argon2.hash('password');

    await User.insert({
      email: 'test@test.com',
      password: hash,
      firstname: 'Test',
      lastname: 'Test',
      departement: {
        id: departement.identifiers[0].id,
      },
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await dataSource.destroy();
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});
