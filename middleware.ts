// middleware.ts ← v root projekta
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_READ_TOKEN || undefined,
});

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("sanitySession")?.value;

  // Če ni tokena in ni na login → ven
  if (!token && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      // TO JE EDINA DELOVAJOČA VERZIJA ZA VSE VERZIJE @sanity/client
      const query = `*[_type == "user" && sessionToken == $token][0]{ email }`;
      const params = { token: token } as any; // ← as any reši vse TS probleme

      const user = await (client.fetch as any)(query, params);

      if (!user) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("sanitySession");
        return res;
      }

      const res = NextResponse.next();
      res.headers.set("x-user-email", user.email);
      return res;
    } catch (error) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("sanitySession");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};