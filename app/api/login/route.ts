// app/api/login/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await writeClient.fetch(
    `*[_type == "user" && email == $email && password == $password][0]`,
    { email, password }
  );

  if (!user) {
    return NextResponse.json({ error: "Napačen email ali geslo" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: "userEmail",
    value: email,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dni
  });

  return response;
}