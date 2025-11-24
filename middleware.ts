// middleware.ts  (v korenu projekta!)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const userEmail = (await request.cookies.get("userEmail")?.value) || null;

  const { pathname } = request.nextUrl;

  // Če gre na /dashboard (ali podstrani) in NI prijavljen → pošlji na domačo stran
  if (pathname.startsWith("/dashboard") && !userEmail) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Če je prijavljen in gre na / (ali /login) → pošlji direktno na dashboard (neobvezno, ampak lepo)
  if (userEmail && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Sicer pustimo naprej
  return NextResponse.next();
}

// Velja za te poti
export const config = {
  matcher: ["/dashboard/:path*", "/", "/login"],
};