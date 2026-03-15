import { NextResponse } from 'next/server';
import { getContactData } from '@/lib/cms';

export async function GET() {
  const data = await getContactData();
  return NextResponse.json({ data });
}
