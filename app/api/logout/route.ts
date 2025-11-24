// app/api/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  (await cookies()).delete("userEmail");
  return NextResponse.redirect(new URL("/", "http://localhost:3000"));
}