import { NextResponse } from 'next/server';
import { getProject, updateProject, softDeleteProject } from '@/lib/actions/projects';
import { projectSchema } from '@/lib/validations/project';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const project = await getProject(id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    // optional validation
    // const parsed = projectSchema.parse(body);
    const updated = await updateProject(id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error(err);
    if (err?.name === 'ZodError') return NextResponse.json({ error: err.errors }, { status: 422 });
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await softDeleteProject(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
