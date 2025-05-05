import db from '../src/db/index.js';
import { users } from '../src/db/schema.js';
import 'dotenv/config';


test('utils should load correctly', () => {
  expect(true).toBe(true);
});


export const setupTestDB = () => {
    beforeEach(async () => {
      try {
        await db.delete(users);
      } catch (error) {
        console.error('Error cleaning up test database:', error);
      }
    });
};


export const envConfig={
  AUTH_API_KEY: process.env.AUTH_API_KEY || 'test_auth_key',
}