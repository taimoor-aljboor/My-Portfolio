import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const newPassword = '200060@Tym';

  console.log('[reset-admin-password] Hashing password...');
  const hashed = await hash(newPassword, 10);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error('[reset-admin-password] User not found with email:', email);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: {
      password: hashed,
      loginAttempts: 0,
      lockedUntil: null,
    },
  });

  console.log('[reset-admin-password] Updated user:', { id: updated.id, email: updated.email });
}

main()
  .catch((e) => {
    console.error('[reset-admin-password] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });