import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public auth routes and internal APIs to be accessed without a token
  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/api/auth') || pathname.startsWith('/api/mcp') || pathname.startsWith('/api/health-check')) {
    const token = request.cookies.get('auth_token')?.value;
    // If they have a token and try to visit login/signup, verify it and redirect to dashboard
    if (token && (pathname === '/login' || pathname === '/signup')) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        // Invalid token, let them proceed to login
      }
    }
    return NextResponse.next();
  }

  // 2. Protect ALL other routes
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // 3. Special protection for /admin
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Token is invalid/expired
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

// Config to match all routes except static files, images, and API routes that aren't protected
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
