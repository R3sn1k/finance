// app/api/login/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";  // ← writeClient!
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await writeClient.fetch(
    `*[_type == "user" && email == $email && password == $password][0]{ _id, email }`,
    { email, password }
  );

  if (!user) {
    return NextResponse.json({ error: "Napačen email ali geslo" }, { status: 401 });
  }

  const sessionToken = uuidv4();

  await writeClient
    .patch(user._id)
    .set({ sessionToken })
    .commit();

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "sanitySession",
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}