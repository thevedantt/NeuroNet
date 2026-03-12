import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { users, userProfiles } from '@/config/schema';
import { hashPassword } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const { email, password, role } = await req.json();
        console.log(`[REGISTER ATTEMPT] Email: ${email}, Role: ${role}`);

        // Validation
        if (!email || !password || !role) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        if (!['user', 'therapist', 'buddy'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role. Must be user, therapist, or buddy.' }, { status: 400 });
        }

        // Check duplicate
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        // Hash
        const hashedPassword = await hashPassword(password);

        // Insert User
        const newUser = await db.insert(users).values({
            email,
            passwordHash: hashedPassword,
            role,
        }).returning({ id: users.id });

        if (!newUser || newUser.length === 0) {
            throw new Error('Failed to create user');
        }

        const userId = newUser[0].id;

        // Create empty profile
        await db.insert(userProfiles).values({
            userId: userId,
        });

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
