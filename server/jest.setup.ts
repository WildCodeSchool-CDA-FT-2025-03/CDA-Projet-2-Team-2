import { dataSource } from './src/database/client';
import { afterAll, beforeAll } from '@jest/globals';

beforeAll(async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
});

afterAll(async () => {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
});
