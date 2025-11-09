import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Portfolio',
  description: 'Portfolio admin dashboard',
  robots: 'noindex, nofollow'
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}