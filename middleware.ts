// middleware.ts (raíz del proyecto Next.js)
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

  // Con token → no puede volver a login/register
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // IMPORTANTE: ya NO reenviamos el token como header.
  // La cookie httpOnly se envía automáticamente en las peticiones al backend
  // gracias a withCredentials: true en axios.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg)$).*)",
  ],
};
