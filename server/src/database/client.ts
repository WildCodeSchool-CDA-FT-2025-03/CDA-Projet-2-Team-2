import { DataSource } from 'typeorm';

import { User } from '../entities/user.entity';
import { Planning } from '../entities/planning.entity';
import { Departement } from '../entities/departement.entity';
import { City } from '../entities/city.entity';
import { Patient } from '../entities/patient.entity';
import { Log } from '../entities/log.entity';

import 'dotenv/config';
import { Appointment } from '../entities/appointment.entity';
import { AppointmentType } from '../entities/appointment-type.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'doctoplan',
  entities: [User, Planning, Departement, City, Patient, Log, Appointment, AppointmentType],
  synchronize: true,
  migrations: ['src/database/migrations/*.ts'],
  logging: process.env.NODE_ENV === 'development',
});
