import { NextResponse } from 'next/server';
import { getPublishedServices } from '@/lib/cms';

export async function GET() {
  const data = await getPublishedServices();
  return NextResponse.json({ data });
}
