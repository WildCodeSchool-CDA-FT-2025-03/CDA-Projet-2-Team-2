import argon2 from 'argon2';
import { dataSource } from './client';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import 'dotenv/config';
import 'reflect-metadata';
import { Departement } from '../entities/departement.entity';

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
    adminUser.status = UserStatus.ACTIVE;

    await adminUser.save();

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
