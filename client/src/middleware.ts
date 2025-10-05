import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/tasks', '/profile', '/admin'];
const publicRoutes = ['/login', '/register', '/'];

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname.replace(/\/$/, '') || '/';
  const token = req.cookies.get('token')?.value;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!token && isProtectedRoute) {
    const absoluteUrl = new URL('/login', req.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }

  if (token && isPublicRoute) {
    const absoluteUrl = new URL('/dashboard', req.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
