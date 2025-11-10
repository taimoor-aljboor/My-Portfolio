import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientForm } from '@/components/client-form';
import { createClient } from '@/lib/actions/client';
import type { ClientFormValues } from '@/lib/validations/client';

export default async function NewClientPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  async function handleCreate(data: ClientFormValues) {
    'use server';

    await createClient(data);
    redirect('/admin/clients');
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Add Client</CardTitle>
          <CardDescription>Create a new client entry and upload their logo.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm onSubmit={handleCreate} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
