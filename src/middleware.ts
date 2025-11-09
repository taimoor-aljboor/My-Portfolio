import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

// Combined middleware with authentication
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check auth token
    try {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });
      
      // Check if user is authenticated and has admin role
      if (!token || token.role !== 'ADMIN') {
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(pathname));
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Allow access to admin routes
    return NextResponse.next();
  }
  
  // Handle internationalization for non-admin routes
  return intlMiddleware(request);
};

export { middleware as default };

export const config = {
  // Match internationalized and admin pathnames
  matcher: ['/', '/admin/:path*', '/(ar|en)/:path*']
};