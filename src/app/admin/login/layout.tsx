import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Admin Dashboard',
  description: 'Login to portfolio admin dashboard',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}