import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  getAdminCookieName,
  getAdminCredentials,
  signAdminToken,
} from '@/lib/auth';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const credentials = getAdminCredentials();

  if (
    email !== credentials.email.toLowerCase() ||
    password !== credentials.password
  ) {
    return NextResponse.json(
      { message: 'Invalid email or password.' },
      { status: 401 },
    );
  }

  const token = await signAdminToken(email);
  const cookieStore = await cookies();
  cookieStore.set(getAdminCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
}
