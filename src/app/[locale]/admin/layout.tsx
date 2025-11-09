import { AdminLayout } from '@/components/layouts/admin-layout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await auth();
  if (!session?.user) {
    redirect('/admin/login');
  }

  return <AdminLayout>{children}</AdminLayout>;
}