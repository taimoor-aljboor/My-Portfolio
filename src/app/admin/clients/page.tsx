import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { listClients, softDeleteClient } from '@/lib/actions/client';
import type { Client } from '@prisma/client';

async function deleteClient(formData: FormData) {
  'use server';

  const id = formData.get('id');
  if (typeof id !== 'string') {
    return;
  }

  await softDeleteClient(id);
}

export default async function ClientsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const clients = await listClients();

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Clients</h2>
            <p className="text-sm text-muted-foreground">
              Showcase the clients you have worked with and manage testimonials.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/clients/new">Add Client</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left">
                    <th className="h-12 px-4 font-medium">Client</th>
                    <th className="h-12 px-4 font-medium">Website</th>
                    <th className="h-12 px-4 font-medium">Display Order</th>
                    <th className="h-12 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 && (
                    <tr>
                      <td className="p-6 text-center text-muted-foreground" colSpan={4}>
                        No clients yet. Add your first client to highlight collaborations.
                      </td>
                    </tr>
                  )}
                  {clients.map((client: Client) => (
                    <tr key={client.id} className="border-t">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          {client.logoUrl ? (
                            <Image
                              src={client.logoUrl}
                              alt={client.nameEn}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-md object-contain"
                            />
                          ) : (
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                              {client.nameEn.charAt(0)}
                            </span>
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium">{client.nameEn}</span>
                            {client.nameAr && <span className="text-xs text-muted-foreground">{client.nameAr}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {client.websiteUrl ? (
                          <a href={client.websiteUrl} className="text-primary underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                            {client.websiteUrl.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">{client.displayOrder ?? 0}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/clients/${client.id}/edit`}>Edit</Link>
                          </Button>
                          <form action={deleteClient}>
                            <input type="hidden" name="id" value={client.id} />
                            <Button variant="ghost" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
