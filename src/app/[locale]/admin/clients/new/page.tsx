'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientForm } from '@/components/client-form';

export default function NewClientPage() {
  const router = useRouter();

  async function handleCreate(data: any) {
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push('/admin/clients');
      } else {
        console.error('Failed to create client');
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Create Client</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm onSubmit={handleCreate} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
