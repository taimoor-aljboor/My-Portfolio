import { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import "./globals.css";

// Latin font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Arabic font
const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: {
    default: 'Your Name - Portfolio',
    template: '%s | Your Name',
  },
  description: 'Personal portfolio showcasing projects, skills, and professional experience.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${inter.variable} ${cairo.variable}`}>
        {children}
      </body>
    </html>
  );
}