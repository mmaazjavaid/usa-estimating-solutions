import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { ensureBaseCmsRecords } from '@/lib/cms';
import { connectToDatabase } from '@/lib/db';
import { ContactDataModel } from '@/models/ContactData';

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  await ensureBaseCmsRecords();
  const data = await ContactDataModel.findOne().lean();
  return NextResponse.json({ data });
}

export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const body = (await request.json()) as {
    emails?: string[];
    phones?: string[];
    address?: string;
  };

  const emails = (body.emails ?? []).map((item) => item.trim()).filter(Boolean);
  const phones = (body.phones ?? []).map((item) => item.trim()).filter(Boolean);
  const address = body.address?.trim() ?? '';

  if (emails.length === 0 || phones.length === 0) {
    return NextResponse.json(
      { message: 'At least one email and one phone are required.' },
      { status: 400 },
    );
  }

  await connectToDatabase();

  const existing = await ContactDataModel.findOne();
  const doc = existing
    ? await ContactDataModel.findByIdAndUpdate(
        existing._id,
        { emails, phones, address },
        { new: true },
      )
    : await ContactDataModel.create({ emails, phones, address });

  return NextResponse.json({ data: doc });
}
