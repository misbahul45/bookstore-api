import { sql } from 'drizzle-orm';
import { mysqlTable, varchar, text, timestamp, tinyint } from 'drizzle-orm/mysql-core';

// Tabel Users
export const users = mysqlTable('users_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`), 
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 255 }), 
  refreshToken: varchar('refresh_token', { length: 512 }), 
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Tabel Books tanpa .check()
export const books = mysqlTable('books_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar('user_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar('title', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  caption: text('caption'),
  image: varchar('image', { length: 255 }),
  rating: tinyint('rating').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});
