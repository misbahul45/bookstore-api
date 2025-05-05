// jest.setup.js
import 'dotenv/config';
import { db } from './src/db/index.js'; // Adjust path to your Drizzle DB setup

// Set default timeout for all tests
jest.setTimeout(20000);

global.console = {
   ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};

// Close the database connection after all tests
afterAll(async () => {
  try {
    // Close the Drizzle MySQL connection
    await db.end();
    console.log('Database connection closed successfully');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});