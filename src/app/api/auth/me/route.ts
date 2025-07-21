import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '../users';

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('user_id')?.value;
  if (!userId) {
    return NextResponse.json({ user: null });
  }
  const user = getUserById(userId);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user: { id: user.id, username: user.username, role: user.role } });
} 