import { NextResponse } from 'next/server';

export async function POST() {
  // Create a response indicating successful logout
  const response = NextResponse.json({ message: 'Logout successful.' });
  
  // Clear the token cookie to log the user out
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
    maxAge: 0, // Expire the cookie immediately
  });

  return response;
}