
import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { userProfiles } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth';

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    const payload = await verifyAccessToken(token);
    return payload ? (payload.sub as string) : null;
}

export async function GET(req: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profiles = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));

        if (profiles.length === 0) {
            return NextResponse.json({}); // Return empty object if no profile found
        }

        return NextResponse.json(profiles[0]);
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            console.log("[API] Unauthorized access to POST /api/profile");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log(`[API] Saving profile for UserID: ${userId}`);

        const body = await req.json();
        console.log("Received profile data for user:", userId, body);


        // Check if profile exists
        const existingProfile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));

        const {
            gender, preferredLanguage, primaryConcern, therapyPreference, previousExperience,
            sleepPattern, supportSystem, stressLevel,
            socialPlatforms, socialPreferences, hobbies, musicDetails, entertainment, inputMetadata
        } = body;

        // Create a type-safe object with potential undefined values
        const rawProfileData = {
            gender,
            preferredLanguage,
            primaryConcern,
            therapyPreference,
            previousExperience,
            sleepPattern,
            supportSystem,
            stressLevel,
            socialPlatforms,
            socialPreferences,
            hobbies,
            musicDetails,
            entertainment,
            inputMetadata,
            updatedAt: new Date(),
        };

        // Remove undefined keys to avoid Drizzle issues or unintentional NULLs
        const profileData = Object.fromEntries(
            Object.entries(rawProfileData).filter(([_, v]) => v !== undefined)
        );

        console.log("Saving Profile Data (Sanitized):", JSON.stringify(profileData, null, 2));

        let savedProfile;

        if (existingProfile.length > 0) {
            // Update existing
            console.log("Updating existing profile for user:", userId);
            try {
                const result = await db.update(userProfiles)
                    .set(profileData)
                    .where(eq(userProfiles.userId, userId))
                    .returning();
                savedProfile = result[0];
                console.log("Updated profile result:", JSON.stringify(savedProfile, null, 2));
            } catch (updateError) {
                console.error("DB Update Error:", updateError);
                throw updateError;
            }
        } else {
            // Create new
            console.log("Creating new profile for user:", userId);
            console.log("Insert Payload:", JSON.stringify({ userId, ...profileData }, null, 2));
            try {
                const result = await db.insert(userProfiles)
                    .values({
                        userId,
                        ...profileData,
                        createdAt: new Date(),
                    })
                    .returning();
                savedProfile = result[0];
                console.log("Created new profile result:", JSON.stringify(savedProfile, null, 2));
            } catch (insertError) {
                console.error("DB Insert Error:", insertError);
                throw insertError;
            }
        }

        return NextResponse.json({ success: true, profile: savedProfile });
    } catch (error) {
        console.error('Profile save error (General):', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
