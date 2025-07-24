import { NextRequest, NextResponse } from 'next/server';
import { validateUser } from '../users';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const user = validateUser(username, password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create response with user data (excluding sensitive info)
    const responseData = {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        companyName: user.companyName
      }
    };

    const response = NextResponse.json(responseData);
    
    // Set HTTP-only cookie for session management
    // In production, you should use secure cookies with SameSite and Secure flags
    response.cookies.set('auth_token', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      // secure: process.env.NODE_ENV === 'production', // Enable in production with HTTPS
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add OPTIONS method for CORS preflight
export const OPTIONS = async () => {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};