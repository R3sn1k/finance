// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/login"));
  response.cookies.delete("sanitySession");
  return response;
}