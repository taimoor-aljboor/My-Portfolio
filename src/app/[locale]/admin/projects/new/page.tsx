'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/components/project-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewProjectPage() {
  const router = useRouter();

  async function handleCreate(data: any) {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push('/admin/projects');
      } else {
        console.error('Failed to create project');
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Create Project</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm onSubmit={handleCreate} />
        </CardContent>
      </Card>
    </div>
  );
}
