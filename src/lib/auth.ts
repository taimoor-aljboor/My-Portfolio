import NextAuth from 'next-auth';
import { authOptions } from './auth-options';

const { auth: nextAuth, handlers } = NextAuth(authOptions);

export const { GET, POST } = handlers;
export const auth = nextAuth;