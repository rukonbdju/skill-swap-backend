import { pgTable, serial, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { skills } from './skills';
const type = pgEnum('type', ['offer', 'request'])

export const userSkills = pgTable('user_skills', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    skillId: integer('skill_id').notNull().references(() => skills.id),
    type: type('type').notNull(),
});
