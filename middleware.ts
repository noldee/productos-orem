// middleware.ts (raíz del proyecto)
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard", "/profile", "/orders"];
  const authRoutes = ["/login", "/register"];

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));

  // Sin token → redirige al login
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Con token → no puede ir a login/register
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Agrega el token al header para que NestJS lo reciba
  const requestHeaders = new Headers(request.headers);
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg)$).*)",
  ],
};
