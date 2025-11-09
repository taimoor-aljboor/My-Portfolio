import { NextResponse } from 'next/server';
import { listEducation, createEducation } from '@/lib/actions/education';
import { educationSchema } from '@/lib/validations/education';

export async function GET() {
  try {
    const items = await listEducation();
    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = educationSchema.parse(body);
    const created = await createEducation(parsed as any);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/admin/education error', err);
    if (err?.name === 'ZodError') return NextResponse.json({ error: err.errors }, { status: 422 });
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
