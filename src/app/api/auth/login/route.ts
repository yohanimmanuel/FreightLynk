import { NextRequest, NextResponse } from 'next/server';
import { validateUser } from '../users';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const user = validateUser(username, password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const res = NextResponse.json({ success: true, role: user.role });
  res.cookies.set('user_id', user.id, { httpOnly: true, path: '/' });
  return res;
} 