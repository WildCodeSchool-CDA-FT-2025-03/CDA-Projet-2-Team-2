import { DataSource } from 'typeorm';

import { Hello } from '../entities/hello.entities';
import { User } from '../entities/user.entity';

import 'dotenv/config';
import { Departement } from '../entities/departement.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'doctoplan',
  entities: [Hello, User, Departement],
  synchronize: true,
  logging: true,
});
