// app/api/login/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await writeClient.fetch(
    `*[_type == "user" && email == $email && password == $password][0]{ _id, email, username }`,
    { email, password }
  );

  if (!user) {
    return NextResponse.json({ error: "Napačen email ali geslo" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  // Shrani email (za stare funkcionalnosti)
  response.cookies.set({
    name: "userEmail",
    value: user.email,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  // Shrani username (da ga vidiš na dashboardu)
  response.cookies.set({
    name: "username",
    value: user.username || user.email.split("@")[0],
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}