// app/api/logout/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function handleLogout(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url)); // po logoutu gre na domačo stran

  // Pobriši cookie-je
  response.cookies.delete("userEmail");
  response.cookies.delete("username");
  response.cookies.delete("sanitySession"); // če ga uporabljaš

  return response;
}

// Podpira tako POST kot GET (ker imaš v headerju <a href="/api/logout">)
export async function POST(request: NextRequest) {
  return handleLogout(request);
}

export async function GET(request: NextRequest) {
  return handleLogout(request);
}