import { NextResponse } from 'next/server';
import { getAchievement, updateAchievement, softDeleteAchievement } from '@/lib/actions/achievement';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const item = await getAchievement(id);
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
    const updated = await updateAchievement(id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await softDeleteAchievement(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
