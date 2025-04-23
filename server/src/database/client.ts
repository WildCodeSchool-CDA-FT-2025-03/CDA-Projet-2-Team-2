import { DataSource } from 'typeorm';

import { Hello } from '../entities/hello.entities';

import 'dotenv/config';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'doctoplan',
  entities: [Hello],
  synchronize: true,
  logging: true,
});
