
import { pgTable, serial, text, timestamp, json, boolean, varchar, integer, date, uuid } from 'drizzle-orm/pg-core';

// 0️⃣ Users Auth Table
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: varchar('role', { length: 20 }).default('user').notNull(), // 'user', 'therapist', 'buddy'
    isOnboardingComplete: boolean('is_onboarding_complete').default(false).notNull(),
    walletAddress: varchar('wallet_address', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 1.5️⃣ Therapist Profiles Table
export const therapistProfiles = pgTable('therapist_profiles', {
    profileId: uuid('profile_id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull().unique(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    mobileNumber: varchar('mobile_number', { length: 20 }),
    licenseNumber: varchar('license_number', { length: 100 }),
    specializations: json('specializations').notNull(), // Array of strings
    perSessionFee: integer('per_session_fee').notNull(),
    preferredSessionType: varchar('preferred_session_type', { length: 50 }), // 'Video', 'Audio', 'Both'
    isVerified: boolean('is_verified').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

// 1️⃣ Doctors Table
export const doctors = pgTable('doctors', {
    doctorId: serial('doctor_id').primaryKey(),
    doctorData: json('doctor_data').notNull(), // Stores name, image, specialization, etc.
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2️⃣ Appointments Table
export const appointments = pgTable('appointments', {
    appointmentId: serial('appointment_id').primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(), // References User (External Auth ID)
    doctorId: varchar('doctor_id', { length: 50 }).notNull(), // Stores ID like "d1", "d4"
    doctorSnapshot: json('doctor_snapshot').notNull(), // Snapshot of doctor details at booking
    appointmentDate: date('appointment_date').notNull(),
    appointmentTime: varchar('appointment_time', { length: 50 }).notNull(),
    sessionType: varchar('session_type', { length: 50 }).default('Video Consultation').notNull(),
    price: integer('price').notNull(), // Stored in lowest currency unit or raw number
    status: varchar('status', { length: 20 }).default('scheduled').notNull(), // scheduled, completed, cancelled, rescheduled
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

// 3️⃣ User Profiles Table
export const userProfiles = pgTable('user_profiles', {
    profileId: serial('profile_id').primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull().unique(), // References User (External Auth ID)
    gender: varchar('gender', { length: 50 }),
    preferredLanguage: varchar('preferred_language', { length: 50 }),
    primaryConcern: varchar('primary_concern', { length: 100 }),
    therapyPreference: varchar('therapy_preference', { length: 50 }),
    previousExperience: varchar('previous_experience', { length: 50 }),
    sleepPattern: varchar('sleep_pattern', { length: 50 }),
    supportSystem: varchar('support_system', { length: 50 }),
    stressLevel: varchar('stress_level', { length: 50 }),
    socialPlatforms: json('social_platforms'), // Array of selected platforms
    socialPreferences: json('social_preferences'), // Key-value object for preferences
    hobbies: json('hobbies'), // Array of hobbies
    musicDetails: json('music_details'), // { genre, artist } if applicable
    entertainment: json('entertainment'), // { bingeType, bingeList, comfortArtist, favoriteComedian }
    inputMetadata: json('input_metadata'), // Stores { fieldId: { inputMethod: 'voice' | 'typed', language: 'en' } }
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

// 4️⃣ AI Chat Sessions
export const aiChatSessions = pgTable('ai_chat_sessions', {
    sessionId: serial('session_id').primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    language: varchar('language', { length: 10 }).default('en').notNull(),
    startedAt: timestamp('started_at').defaultNow().notNull(),
    endedAt: timestamp('ended_at'),
    summary: text('summary'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5️⃣ AI Chat Messages
export const aiChatMessages = pgTable('ai_chat_messages', {
    messageId: serial('message_id').primaryKey(),
    sessionId: integer('session_id').references(() => aiChatSessions.sessionId).notNull(),
    sender: varchar('sender', { length: 20 }).notNull(), // 'user' | 'ai'
    messageText: text('message_text').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6️⃣ AI Chat Insights
export const aiChatInsights = pgTable('ai_chat_insights', {
    insightId: serial('insight_id').primaryKey(),
    sessionId: integer('session_id').references(() => aiChatSessions.sessionId).notNull(),
    currentTopic: varchar('current_topic', { length: 255 }),
    emotionalTone: json('emotional_tone'), // e.g. { "Calmness": 75, "Anxiety": 10 }
    suggestionText: text('suggestion_text'),
    language: varchar('language', { length: 10 }).default('en'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7️⃣ Chat Access Grants (mirrors on-chain access control for fast queries)
export const chatAccessGrants = pgTable('chat_access_grants', {
    grantId: serial('grant_id').primaryKey(),
    patientUserId: varchar('patient_user_id', { length: 255 }).notNull(),       // User who owns the data
    therapistUserId: varchar('therapist_user_id', { length: 255 }).notNull(),   // Therapist who was granted access
    patientWallet: varchar('patient_wallet', { length: 255 }).notNull(),         // Patient's wallet address
    therapistWallet: varchar('therapist_wallet', { length: 255 }).notNull(),     // Therapist's wallet address
    sessionId: integer('session_id').references(() => aiChatSessions.sessionId).notNull(),
    ipfsCid: varchar('ipfs_cid', { length: 255 }).notNull(),                    // The IPFS CID that was shared
    txHash: varchar('tx_hash', { length: 255 }),                                // On-chain transaction hash
    isActive: boolean('is_active').default(true).notNull(),                      // Soft-delete for revocation
    grantedAt: timestamp('granted_at').defaultNow().notNull(),
    revokedAt: timestamp('revoked_at'),
});
