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

  // Protect chat route and its API endpoints
  const protectedRoutes = ['/chat', '/api/chat', '/api/chat-history'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      // For API routes, return unauthorized response
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      // For other routes, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Update matcher to include all protected routes and their API endpoints
export const config = {
  matcher: [
    '/chat/:path*',
    '/api/chat/:path*',
    '/api/chat-history/:path*',
    '/login',
    '/register'
  ]
};