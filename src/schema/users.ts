import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    avatarUrl: varchar('avatar_url', { length: 500 }),
    bio: varchar('bio', { length: 500 }),
    createdAt: timestamp('created_at').defaultNow(),
});

