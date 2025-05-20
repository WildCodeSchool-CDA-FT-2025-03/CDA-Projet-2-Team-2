import argon2 from 'argon2';
import { dataSource } from './client';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import 'dotenv/config';
import 'reflect-metadata';
import { Departement } from '../entities/departement.entity';
import { seedDoctors } from './seed-fakeDoctors';

async function seedDatabase() {
  console.info('🌱 Starting database seeding...');

  try {
    await dataSource.initialize();
    console.info('📊 Database connection initialized');

    const existingAdmin = await User.findOne({
      where: { email: 'admin@doctoplan.com' },
    });

    if (existingAdmin) {
      console.info('👤 Admin user already exists, skipping creation');
      return;
    }
    const newDepartement = new Departement();
    newDepartement.label = 'Administration';
    newDepartement.building = 'A';
    newDepartement.wing = 'droite';
    newDepartement.level = 'RDC';
    await newDepartement.save();

    const hashedPassword = await argon2.hash(process.env.ADMIN_PASSWORD || 'admin123');

    const adminUser = new User();
    adminUser.email = 'admin@doctoplan.com';
    adminUser.password = hashedPassword;
    adminUser.role = UserRole.ADMIN;
    adminUser.firstname = 'Admin';
    adminUser.lastname = 'User';
    adminUser.departement = newDepartement;
    adminUser.profession = 'Administrateur';
    adminUser.gender = 'M';
    adminUser.tel = '0606060606';
    adminUser.status = UserStatus.ACTIVE;

    await adminUser.save();

    const hashedSecPassword = await argon2.hash(process.env.SECRETARY_PASSWORD || 'secretary123');

    const secretaryUser = new User();
    secretaryUser.email = 'secretary@doctoplan.com';
    secretaryUser.password = hashedSecPassword;
    secretaryUser.role = UserRole.SECRETARY;
    secretaryUser.firstname = 'secretary';
    secretaryUser.lastname = 'User';
    secretaryUser.departement = newDepartement;
    secretaryUser.status = UserStatus.ACTIVE;

    await secretaryUser.save();
    try {
      await seedDoctors();
      console.info('✅ Doctors seeded successfully');
    } catch (error) {
      console.error('❌ Failed to seed doctors:', error);
    }

    console.info('✅ Admin user created successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await dataSource.destroy();
    console.info('🔌 Database connection closed');
  }
}

seedDatabase()
  .then(() => {
    console.info('🎉 Database seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error during seeding:', error);
    process.exit(1);
  });
