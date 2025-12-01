// app/api/logout/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));

  // Briše vse možne cookie-je, ki smo jih uporabljali
  response.cookies.delete("userEmail");
  response.cookies.delete("sanitySession");

  return response;
}

// Če kdo klikne samo link (GET), tudi deluje
export async function GET(request: NextRequest) {
  return POST(request);
}