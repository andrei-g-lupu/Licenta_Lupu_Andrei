import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Allow access to login and register pages
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (token) {
      // If user is already logged in, redirect to chat
      return NextResponse.redirect(new URL('/chat', request.url));
    }
    return NextResponse.next();
  }

  // Protect chat route
  const protectedRoutes = ['/chat'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      // Save the URL they tried to visit
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Update matcher to include protected routes
export const config = {
  matcher: ['/chat/:path*', '/login', '/register']
};