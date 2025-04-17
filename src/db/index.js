import { drizzle } from 'drizzle-orm/mysql2';
import 'dotenv/config'

const db = drizzle(process.env.DATABASE_URL);

export default db;
