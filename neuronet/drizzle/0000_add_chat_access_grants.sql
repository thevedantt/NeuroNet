CREATE TABLE "ai_chat_insights" (
	"insight_id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"current_topic" varchar(255),
	"emotional_tone" json,
	"suggestion_text" text,
	"language" varchar(10) DEFAULT 'en',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_chat_messages" (
	"message_id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"sender" varchar(20) NOT NULL,
	"message_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_chat_sessions" (
	"session_id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"language" varchar(10) DEFAULT 'en' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"appointment_id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"doctor_id" varchar(50) NOT NULL,
	"doctor_snapshot" json NOT NULL,
	"appointment_date" date NOT NULL,
	"appointment_time" varchar(50) NOT NULL,
	"session_type" varchar(50) DEFAULT 'Video Consultation' NOT NULL,
	"price" integer NOT NULL,
	"status" varchar(20) DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_access_grants" (
	"grant_id" serial PRIMARY KEY NOT NULL,
	"patient_user_id" varchar(255) NOT NULL,
	"therapist_user_id" varchar(255) NOT NULL,
	"patient_wallet" varchar(255) NOT NULL,
	"therapist_wallet" varchar(255) NOT NULL,
	"session_id" integer NOT NULL,
	"ipfs_cid" varchar(255) NOT NULL,
	"tx_hash" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"granted_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"doctor_id" serial PRIMARY KEY NOT NULL,
	"doctor_data" json NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "therapist_profiles" (
	"profile_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"mobile_number" varchar(20),
	"license_number" varchar(100),
	"specializations" json NOT NULL,
	"per_session_fee" integer NOT NULL,
	"preferred_session_type" varchar(50),
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "therapist_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"profile_id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"gender" varchar(50),
	"preferred_language" varchar(50),
	"primary_concern" varchar(100),
	"therapy_preference" varchar(50),
	"previous_experience" varchar(50),
	"sleep_pattern" varchar(50),
	"support_system" varchar(50),
	"stress_level" varchar(50),
	"social_platforms" json,
	"social_preferences" json,
	"hobbies" json,
	"music_details" json,
	"entertainment" json,
	"input_metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"is_onboarding_complete" boolean DEFAULT false NOT NULL,
	"wallet_address" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ai_chat_insights" ADD CONSTRAINT "ai_chat_insights_session_id_ai_chat_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."ai_chat_sessions"("session_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_chat_messages" ADD CONSTRAINT "ai_chat_messages_session_id_ai_chat_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."ai_chat_sessions"("session_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_access_grants" ADD CONSTRAINT "chat_access_grants_session_id_ai_chat_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."ai_chat_sessions"("session_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "therapist_profiles" ADD CONSTRAINT "therapist_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;