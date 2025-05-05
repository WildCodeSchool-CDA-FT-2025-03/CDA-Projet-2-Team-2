import type { Config } from 'jest';
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  moduleFileExtensions: ['js', 'ts'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
} satisfies Config;
