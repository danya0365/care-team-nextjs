import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'care-team-default-secret-change-me-in-production';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  // 1. Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!sessionCookie || !sessionCookie.value) {
      // No token, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify token
      await jwtVerify(sessionCookie.value, encodedSecret);
      return NextResponse.next();
    } catch (error) {
      // Cryptographically invalid token - CLEAR it and redirect to login
      console.error('🛡️ Cryptographically invalid token detected, clearing session.');
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  // 2. Prevent logged-in users from accessing /login
  if (pathname === '/login') {
    // If we are arriving at login because the App Layer found the session STALE (e.g. user deleted)
    // We MUST clear the cookie and NOT redirect back to admin.
    if (searchParams.get('reason') === 'stale') {
      console.log('🛡️ Session marked as stale by app, clearing and staying on login.');
      const response = NextResponse.next();
      response.cookies.delete('session');
      return response;
    }

    if (sessionCookie && sessionCookie.value) {
      try {
        await jwtVerify(sessionCookie.value, encodedSecret);
        // If JWT is valid and NOT marked as stale, redirect to admin
        return NextResponse.redirect(new URL('/admin/events', request.url));
      } catch (e) {
        // Invalid token, allow access to login but clear the bad cookie
        const response = NextResponse.next();
        response.cookies.delete('session');
        return response;
      }
    }
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware should run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
