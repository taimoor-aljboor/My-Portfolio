// Use the regular Prisma client (Node runtime) so local development works with a standard
// `postgresql://` DATABASE_URL. The `/edge` client requires the Prisma Data Proxy or
// a `prisma+` URL with an API key which isn't needed for local DB development.
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;