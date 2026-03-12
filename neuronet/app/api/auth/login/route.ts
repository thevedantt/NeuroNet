import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { users } from '@/config/schema';
import { verifyPassword, createAccessToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
        }

        // Find user
        const userResult = await db.select().from(users).where(eq(users.email, email));
        const user = userResult[0];

        if (!user) {
            // Use 401 for invalid credentials
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT
        // Payload: sub, email, role, exp (handled by createAccessToken)
        const token = await createAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
            isOnboardingComplete: user.isOnboardingComplete,
        });

        const response = NextResponse.json({
            access_token: token,
            token_type: 'bearer',
            role: user.role,
            isOnboardingComplete: user.isOnboardingComplete,
        });

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 30, // 30 minutes
            path: '/',
        });

        // Also set a non-httpOnly cookie for role if needed by simple client checks, 
        // but we return it in body primarily.

        return response;

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
