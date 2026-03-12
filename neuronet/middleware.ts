import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key_change_me'
const encodedKey = new TextEncoder().encode(SECRET_KEY)

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    console.log("Middleware hitting path:", path)

    // 1. Define guarded routes
    const isTherapistRoute = path.startsWith('/therapist')
    const isBuddyRoute = path.startsWith('/buddy')
    const isUserRoute = path.startsWith('/dashboard') || path.startsWith('/chat-ai') || path.startsWith('/profile') || path.startsWith('/editprofile') || path.startsWith('/assessment') || path.startsWith('/doctors')

    // 2. Exclude auth routes and public assets
    if (path.startsWith('/api') || path.startsWith('/_next') || path.startsWith('/static') || path.startsWith('/auth') || path === '/') {
        return NextResponse.next()
    }

    // 3. Get Token
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
        // If trying to access protected route without token, redirect to login
        if (isTherapistRoute || isBuddyRoute || isUserRoute) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
        return NextResponse.next()
    }

    try {
        // 4. Verify & Decode Token
        const { payload } = await jwtVerify(token, encodedKey)
        const role = payload.role as string
        const isOnboardingComplete = payload.isOnboardingComplete as boolean

        // 5. Role-Based Access Control

        // CHECK: Root redirects for role bases (prevent 404 on /therapist or /buddy)
        if (path === '/therapist') {
            return NextResponse.redirect(new URL('/therapist/dashboard', request.url))
        }
        if (path === '/buddy') {
            return NextResponse.redirect(new URL('/buddy/dashboard', request.url))
        }

        // CHECK: Mandatory Onboarding for Therapists
        if (role === 'therapist' && !isOnboardingComplete && path !== '/therapist/onboarding') {
            return NextResponse.redirect(new URL('/therapist/onboarding', request.url))
        }

        // CASE A: User accessing Therapist routes
        if (isTherapistRoute && role !== 'therapist') {
            // Redirect to their correct dashboard
            return redirectToDashboard(role, request)
        }

        // CASE B: User/Therapist accessing Buddy routes
        if (isBuddyRoute && role !== 'buddy') {
            return redirectToDashboard(role, request)
        }

        // CASE C: Therapist/Buddy accessing User routes (Optional: decide if strict separation needed)
        // If we want strict separation:
        // if (isUserRoute && role !== 'user') {
        // Maybe allow? Or redirect? 
        // Typically therapists might have their own dashboard, not the user one.
        // Let's enforce strictness for clarity.
        // return redirectToDashboard(role, request)
        // }
        // Actually, let's stick to the prompt: "A therapist must not access user data".
        // if (isUserRoute && role === 'therapist') {
        //    return redirectToDashboard(role, request)
        // }
        if (isUserRoute && role === 'therapist') {
            return redirectToDashboard(role, request)
        }
        if (isUserRoute && role === 'buddy') {
            return redirectToDashboard(role, request)
        }

        return NextResponse.next()

    } catch (err) {
        // Token invalid/expired
        const response = NextResponse.redirect(new URL('/auth/login', request.url))
        // Clear cookie
        response.cookies.delete('auth_token')
        return response
    }
}

function redirectToDashboard(role: string, request: NextRequest) {
    if (role === 'therapist') {
        return NextResponse.redirect(new URL('/therapist/dashboard', request.url))
    } else if (role === 'buddy') {
        return NextResponse.redirect(new URL('/buddy/dashboard', request.url))
    } else {
        return NextResponse.redirect(new URL('/editprofile', request.url))
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
