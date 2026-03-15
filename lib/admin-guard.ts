import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAdminCookieName, verifyAdminToken } from '@/lib/auth';

export async function requireAdminApi() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getAdminCookieName())?.value;

    if (!token) {
      return { authorized: false, response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
    }

    await verifyAdminToken(token);
    return { authorized: true as const };
  } catch {
    return { authorized: false, response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }
}
