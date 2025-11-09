import { NextResponse } from 'next/server';
import { getEducation, updateEducation, softDeleteEducation } from '@/lib/actions/education';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const item = await getEducation(id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const updated = await updateEducation(id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await softDeleteEducation(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
