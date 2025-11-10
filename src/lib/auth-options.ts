import type { NextAuthConfig } from 'next-auth';
import type { Session, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/db';
import { verifyPassword, isAccountLocked, calculateLockDuration } from '@/lib/auth-utils';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      name: string;
    }
  }

  interface User {
    id: string;
    role: string;
    email: string;
    name: string;
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        code: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials: Partial<Record<"email" | "password" | "code", unknown>>, req: Request) {
        // Add debug logging to make authentication failures visible in the dev server logs.
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          // Find user
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Check account lock
          if (isAccountLocked(user.loginAttempts, user.lockedUntil)) {
            throw new Error('Account is locked. Please try again later');
          }

          // Verify password
          if (typeof user.password !== 'string') {
            throw new Error('Invalid email or password');
          }
          const isValid = await verifyPassword(credentials.password as string, user.password);

          if (!isValid) {
            // Increment login attempts and possibly lock account
            const attempts = user.loginAttempts + 1;
            await prisma.user.update({
              where: { id: user.id },
              data: {
                loginAttempts: attempts,
                lockedUntil: attempts >= 5 ? new Date(Date.now() + calculateLockDuration(attempts)) : null,
              },
            });
            throw new Error('Invalid email or password');
          }

          // Check 2FA if enabled
          if (user.twoFactorEnabled) {
            if (!credentials.code) {
              throw new Error('2FA code is required.');
            }
            // TODO: Implement 2FA code verification
          }

          // Reset login attempts on successful login
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: 0,
              lockedUntil: null,
              lastLoginAt: new Date(),
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? user.email,
            role: user.role,
          };
        } catch (err: any) {
          // Log useful debug info to the server console. Do not leak passwords.
          try {
            console.error('[Auth][authorize] email=', credentials?.email, 'error=', err?.message || err);
          } catch (e) {
            console.error('[Auth][authorize] error logging failure', e);
          }
          // Re-throw the error so NextAuth can handle it and return an appropriate error code.
          throw err;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      
      // Handle user updates
      if (trigger === 'update' && session) {
        Object.assign(token, session);
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  } satisfies NextAuthConfig['callbacks'],
};