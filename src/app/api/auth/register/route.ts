import { NextRequest, NextResponse } from 'next/server';
import { addUser, findUserByUsername, User } from '../users';
import { randomUUID } from 'crypto';

const allowedRoles = ['client', 'forwarder', 'logisticsprovider'];

export async function POST(req: NextRequest) {
  const { username, password, role } = await req.json();
  if (!username || !password || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  if (findUserByUsername(username)) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  const user: User = { id: randomUUID(), username, password, role };
  addUser(user);
  return NextResponse.json({ success: true });
} 