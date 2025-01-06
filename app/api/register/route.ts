

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '../../../lib/db'; // Adjust the path based on your project structure
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

export async function POST(request: Request) {
  console.log('POST /api/register request received');

  try {
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required.' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const newUser = await pool.query<User>(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, passwordHash]
    );

    return NextResponse.json(
      { message: 'User registered successfully.', user: newUser.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}