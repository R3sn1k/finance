// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Preveri, ali je uporabnik prijavljen (ima cookie "userEmail")
  const isLoggedIn = request.cookies.has("userEmail");

  // 1. Zaščita dashboarda: samo za prijavljene
  if (path.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", path); // opcionalno: da se po loginu vrne nazaj
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Prepreči dostop do javnih strani, če je že prijavljen
  if (path === "/" || path === "/login" || path === "/registracija") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Za vse ostalo dovoli normalen dostop
  return NextResponse.next();
}

// Middleware teče na teh poteh
export const config = {
  matcher: [
    "/",
    "/login",
    "/registracija",
    "/dashboard/:path*", // vse pod /dashboard
  ],
};