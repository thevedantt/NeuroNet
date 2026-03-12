import { hash, compare } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key_change_me';
const encodedKey = new TextEncoder().encode(SECRET_KEY);

export async function hashPassword(password: string): Promise<string> {
    return await hash(password, 10); // 10 rounds roughly equivalent to standard defaults
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
    return await compare(password, hashed);
}

export async function createAccessToken(payload: Record<string, any>): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30m')
        .sign(encodedKey);
}

export async function verifyAccessToken(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, encodedKey);
        return payload;
    } catch (error) {
        return null;
    }
}
