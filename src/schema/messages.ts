import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sessions } from './sessions';
import { users } from './users';

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    sessionId: integer('session_id').notNull().references(() => sessions.id),
    senderId: integer('sender_id').notNull().references(() => users.id),
    content: varchar('content', { length: 1000 }).notNull(),
    sentAt: timestamp('sent_at').defaultNow(),
});
