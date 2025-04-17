 import { defineConfig } from 'drizzle-kit';
import 'dotenv/config'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.js',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});