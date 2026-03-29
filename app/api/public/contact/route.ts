import { NextResponse } from 'next/server';
import { getContactData } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getContactData();
  return NextResponse.json(
    { data },
    {
      headers: {
        'Cache-Control': 'private, no-store, must-revalidate',
      },
    },
  );
}
