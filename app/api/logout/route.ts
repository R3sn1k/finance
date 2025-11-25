// app/api/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  (await cookies()).delete("userEmail");
  return NextResponse.redirect(new URL("/", request.url));
}