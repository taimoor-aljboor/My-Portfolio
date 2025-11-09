import { NextResponse } from 'next/server';
import { listCourses, createCourse } from '@/lib/actions/course';
import { courseSchema } from '@/lib/validations/course';

export async function GET() {
  try {
    const items = await listCourses();
    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = courseSchema.parse(body);
    const created = await createCourse(parsed as any);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/admin/courses error', err);
    if (err?.name === 'ZodError') return NextResponse.json({ error: err.errors }, { status: 422 });
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
