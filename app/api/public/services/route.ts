import { NextResponse } from 'next/server';
import { getPublishedServices } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getPublishedServices();
  return NextResponse.json(
    { data },
    {
      headers: {
        'Cache-Control': 'private, no-store, must-revalidate',
      },
    },
  );
}
