// File: c:/Tutorial_Rag/app/login/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'; // Assuming bcrypt is used for password hashing
import jwt from 'jsonwebtoken';
import pool from '../../../lib/db'; // Internal database client
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Define the User interface based on your database schema
interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

export async function POST(request: Request) {
  console.log('POST /login request received');

  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Fetch user from the database
    const res = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    const user = res.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json({ message: 'Login successful.' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour in seconds
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}