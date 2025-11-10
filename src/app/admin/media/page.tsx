import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteMediaAsset, listMediaAssets } from '@/lib/actions/media';
import type { MediaAsset } from '@prisma/client';

async function removeMedia(formData: FormData) {
  'use server';

  const id = formData.get('id');
  if (typeof id !== 'string') {
    return;
  }

  await deleteMediaAsset(id);
}

export default async function MediaLibraryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const mediaAssets = await listMediaAssets();

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>Browse and manage uploaded assets used across your portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          {mediaAssets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No media assets uploaded yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mediaAssets.map((asset: MediaAsset) => (
                <div key={asset.id} className="space-y-3 rounded-lg border p-4">
                  <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                    {asset.type === 'image' ? (
                      <Image
                        src={asset.url}
                        alt={asset.altTextEn || asset.filename || 'Media asset'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        <span>{asset.filename}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">{asset.filename}</div>
                    <div className="text-muted-foreground">{asset.contentType ?? asset.type}</div>
                    <div className="text-muted-foreground">
                      Owner: <span className="font-medium">{asset.ownerType}</span>
                      {asset.ownerId && asset.ownerId !== 'pending' && ` · ${asset.ownerId}`}
                    </div>
                    <Link href={asset.url} target="_blank" rel="noreferrer" className="text-primary underline-offset-2 hover:underline">
                      Open file
                    </Link>
                  </div>
                  <form action={removeMedia}>
                    <input type="hidden" name="id" value={asset.id} />
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Delete
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
