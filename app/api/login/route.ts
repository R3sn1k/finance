import { NextResponse } from "next/server";
import { client as sanityClient } from "../../../sanity/lib/client";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await sanityClient.fetch(
    `*[_type == "user" && email == $email && password == $password][0]`,
    { email, password }
  );

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("userEmail", email, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dni
  });

  return response;
}
