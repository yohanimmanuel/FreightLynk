import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '../users';

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('auth_token')?.value;
  if (!userId) {
    return NextResponse.json({ user: null });
  }
  const user = getUserById(userId);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ 
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
  });
} 