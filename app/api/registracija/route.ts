// app/api/register/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  const existing = await writeClient.fetch(
    `*[_type == "user" && (email == $email || username == $username)][0]`,
    { email, username }
  );

  if (existing) {
    return NextResponse.json(
      { error: "Email ali uporabniško ime že obstaja!" },
      { status: 400 }
    );
  }

  await writeClient.create({
    _type: "user",
    username,
    email,
    password,
  });

  return NextResponse.json({ success: true });
}