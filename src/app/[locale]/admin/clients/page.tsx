import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listClients } from '@/lib/actions/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminClientsPage() {
  const clients = await listClients();

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Clients</h2>
        <Link href="/admin/clients/new">
          <Button>Create Client</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p>No clients yet.</p>
          ) : (
            <ul className="space-y-2">
              {clients.map((c) => (
                <li key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {c.logoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logoUrl} alt={c.nameEn} className="h-10 w-10 object-cover" />
                    )}
                    <span>{c.nameEn}</span>
                  </div>
                  <div className="space-x-2">
                    <Link href={`/admin/clients/${c.id}`}>Edit</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
