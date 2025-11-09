import { NextResponse } from 'next/server';
import { listProjects, createProject } from '@/lib/actions/projects';
import { projectSchema } from '@/lib/validations/project';

export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json(projects);
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Validate incoming payload (optional)
    const parsed = projectSchema.parse(body);
    const project = await createProject(parsed as any);
    return NextResponse.json(project, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/admin/projects error', err);
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: err.errors }, { status: 422 });
    }
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
