import {
    pgTable,
    serial,
    integer,
    varchar,
    text,
    timestamp,
    boolean,
    primaryKey,
    pgEnum,
    unique,
    json,
    uuid
} from 'drizzle-orm/pg-core'

// --------------------- ENUMS ---------------------
export const userRoleEnum = pgEnum('user_role', ['user', 'admin'])
export const sessionStatusEnum = pgEnum('session_status', ['pending', 'confirmed', 'completed', 'cancelled'])
export const notificationTypeEnum = pgEnum('notification_type', ['session', 'review', 'system'])

// --------------------- USERS ---------------------
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull().unique(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 150 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    bio: text('bio'),
    avatarUrl: varchar('avatar_url', { length: 255 }),
    role: userRoleEnum('role').default('user'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
})

// --------------------- SKILLS ---------------------
export const skills = pgTable('skills', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    description: text('description')
})

// --------------------- CATEGORIES ---------------------
export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique()
})

// --------------------- SKILL CATEGORIES ---------------------
export const skillCategories = pgTable('skill_categories', {
    skillId: integer('skill_id').references(() => skills.id).notNull(),
    categoryId: integer('category_id').references(() => categories.id).notNull(),
}

)

// --------------------- USER SKILLS ---------------------
export const userSkills = pgTable('user_skills', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    skillId: integer('skill_id').references(() => skills.id).notNull(),
    isOffering: boolean('is_offering').default(true),
    experience: text('experience'),
}, (table) => ({
    uniqueUserSkill: unique().on(table.userId, table.skillId, table.isOffering)
}))

// --------------------- SESSIONS ---------------------
export const sessions = pgTable('sessions', {
    id: serial('id').primaryKey(),
    requesterId: integer('requester_id').references(() => users.id).notNull(),
    providerId: integer('provider_id').references(() => users.id).notNull(),
    skillId: integer('skill_id').references(() => skills.id).notNull(),
    status: sessionStatusEnum('status').default('pending'),
    scheduledAt: timestamp('scheduled_at').notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
})

// --------------------- REVIEWS ---------------------
export const reviews = pgTable('reviews', {
    id: serial('id').primaryKey(),
    sessionId: integer('session_id').references(() => sessions.id).notNull().unique(),
    reviewerId: integer('reviewer_id').references(() => users.id).notNull(),
    rating: integer('rating').notNull(), // out of 5
    comment: text('comment'),
    createdAt: timestamp('created_at').defaultNow()
})

// --------------------- FAVORITES ---------------------
export const favorites = pgTable('favorites', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    favoriteUserId: integer('favorite_user_id').references(() => users.id).notNull()
}, (table) => ({
    uniqueFavorite: unique().on(table.userId, table.favoriteUserId)
}))

// --------------------- MESSAGES ---------------------
export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    sessionId: integer('session_id').references(() => sessions.id).notNull(),
    senderId: integer('sender_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    sentAt: timestamp('sent_at').defaultNow()
})

// --------------------- NOTIFICATIONS ---------------------
export const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    type: notificationTypeEnum('type').notNull(),
    data: json('data').notNull(), // flexible for different notif types
    isRead: boolean('is_read').default(false),
    createdAt: timestamp('created_at').defaultNow()
})
