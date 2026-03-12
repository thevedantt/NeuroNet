import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { users, therapistProfiles } from '@/config/schema';
import { verifyAccessToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) { // This handles GET /auth/me
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const payload = await verifyAccessToken(token);

        if (!payload || !payload.sub) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        const userId = payload.sub as string;

        // Fetch user from DB to ensure validity and return fresh data
        const userResult = await db.select().from(users).where(eq(users.id, userId));
        const user = userResult[0];

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        let profileData = {};

        if (user.role === 'therapist') {
            try {
                const tProfile = await db.select().from(therapistProfiles).where(eq(therapistProfiles.userId, userId));
                if (tProfile && tProfile.length > 0) {
                    profileData = tProfile[0];
                }
            } catch (err) {
                console.error("Error fetching therapist profile", err);
            }
        }

        return NextResponse.json({
            id: user.id,
            email: user.email,
            role: user.role,
            walletAddress: user.walletAddress || null,
            ...profileData
        });

    } catch (error) {
        console.error("Auth Me Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
