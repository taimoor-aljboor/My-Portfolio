import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientForm } from '@/components/client-form';
import { getClient, updateClient } from '@/lib/actions/client';
import type { ClientFormValues } from '@/lib/validations/client';
import type { Client } from '@prisma/client';

function mapClientToFormValues(client: Client): ClientFormValues {
  return {
    nameEn: client.nameEn,
    nameAr: client.nameAr ?? '',
    logoUrl: client.logoUrl ?? '',
    websiteUrl: client.websiteUrl ?? '',
    testimonialEn: client.testimonialEn ?? '',
    testimonialAr: client.testimonialAr ?? '',
    displayOrder: client.displayOrder ?? 0,
  };
}

interface EditClientPageProps {
  params: {
    id: string;
  };
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const client = await getClient(params.id);

  if (!client || client.deletedAt) {
    notFound();
  }

  const initialValues = mapClientToFormValues(client);

  async function handleUpdate(data: ClientFormValues) {
    'use server';

    await updateClient(params.id, data);
    redirect('/admin/clients');
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Edit Client</CardTitle>
          <CardDescription>Update client details, website links, and testimonials.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm initialData={initialValues} onSubmit={handleUpdate} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
