import { pgTable, serial, integer, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { skills } from './skills';
const status = pgEnum('status', ['pending', 'confirmed', 'completed', 'cancelled']);

export const sessions = pgTable('sessions', {
    id: serial('id').primaryKey(),
    providerId: integer('provider_id').notNull().references(() => users.id),
    learnerId: integer('learner_id').notNull().references(() => users.id),
    skillId: integer('skill_id').notNull().references(() => skills.id),
    status: status('status').default('pending'),
    scheduledAt: timestamp('scheduled_at').notNull(),
    durationMinutes: varchar('duration_minutes', { length: 10 }).notNull(),
    notes: varchar('notes', { length: 1000 }),
    createdAt: timestamp('created_at').defaultNow(),
});
