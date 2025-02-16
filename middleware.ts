import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Create response headers to prevent caching
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  // Allow access to login and register pages
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (token) {
      // If user is already logged in, redirect to chat
      const response = NextResponse.redirect(new URL('/chat', request.url));
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return response;
    }
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  }

  // Protect chat route and its API endpoints
  const protectedRoutes = ['/chat', '/api/chat', '/api/chat-history'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      // For API routes, return unauthorized response
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized' }, 
          { 
            status: 401,
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
          }
        );
      }
      // For other routes, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      const response = NextResponse.redirect(url);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return response;
    }
  }

  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  return response;
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