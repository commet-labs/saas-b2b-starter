import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Example table - you can modify this later
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Export all tables for Drizzle to use
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
