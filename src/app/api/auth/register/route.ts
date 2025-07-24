import { NextRequest, NextResponse } from 'next/server';
import { addUser, findUserByUsername, UserRole } from '../users';

const allowedRoles: UserRole[] = ['client', 'forwarder', 'logisticsprovider'];

export async function POST(req: NextRequest) {
  try {
    let {
  username, password, role, fullName, companyName,
  companyAddress, companyWebsite, companySize, userType, otherUserType,
  businessOperations, goodsTypes, shippingFrequency, primaryRoutes, jobTitle, phone
} = await req.json();
// Ensure all fields are strings or null
fullName = typeof fullName === 'string' ? fullName : '';
companyName = typeof companyName === 'string' ? companyName : '';
companyAddress = typeof companyAddress === 'string' ? companyAddress : '';
companyWebsite = typeof companyWebsite === 'string' ? companyWebsite : '';
companySize = typeof companySize === 'string' ? companySize : '';
userType = typeof userType === 'string' ? userType : '';
otherUserType = typeof otherUserType === 'string' ? otherUserType : '';
businessOperations = typeof businessOperations === 'string' ? businessOperations : '';
goodsTypes = typeof goodsTypes === 'string' ? goodsTypes : '';
shippingFrequency = typeof shippingFrequency === 'string' ? shippingFrequency : '';
primaryRoutes = typeof primaryRoutes === 'string' ? primaryRoutes : '';
jobTitle = typeof jobTitle === 'string' ? jobTitle : '';
phone = typeof phone === 'string' ? phone : '';
console.log('Registering user:', { username, password, role, fullName, companyName, companyAddress, companyWebsite, companySize, userType, otherUserType, businessOperations, goodsTypes, shippingFrequency, primaryRoutes, jobTitle, phone });
    
    // Validate required fields
    if (!username || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Validate role
    if (!allowedRoles.includes(role as UserRole)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' }, 
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = findUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' }, 
        { status: 409 }
      );
    }

    // Create new user
    const user = await addUser({
      username,
      password, // In production, hash the password before saving
      role: role as UserRole,
      fullName,
      companyName,
      companyAddress,
      companyWebsite,
      companySize,
      userType,
      otherUserType,
      businessOperations,
      goodsTypes,
      shippingFrequency,
      primaryRoutes,
      jobTitle,
      phone
    });

    // Robust check for user object
    if (!user || !user.id) {
      console.error('User insert succeeded but user object is incomplete:', user);
      return NextResponse.json(
        { success: false, error: 'Registration failed (user object incomplete).' },
        { status: 500 }
      );
    }
    console.log('Inserted user:', user);

    const responseData = {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        companyName: user.companyName,
        companyAddress: user.companyAddress,
        companyWebsite: user.companyWebsite,
        companySize: user.companySize,
        userType: user.userType,
        otherUserType: user.otherUserType,
        businessOperations: user.businessOperations,
        goodsTypes: user.goodsTypes,
        shippingFrequency: user.shippingFrequency,
        primaryRoutes: user.primaryRoutes,
        jobTitle: user.jobTitle,
        phone: user.phone
      }
    };

    const response = NextResponse.json(responseData);
    response.cookies.set('auth_token', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      // secure: process.env.NODE_ENV === 'production', // Enable in production with HTTPS
    });
    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Add OPTIONS method for CORS preflight
// This is important for API routes that are called from the browser
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