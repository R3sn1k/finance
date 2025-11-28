// app/api/login/route.ts
import { NextResponse } from "next/server";
import { client as sanityClient } from "../../../sanity/lib/client";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Preveri uporabnika v Sanity
  const user = await sanityClient.fetch(
    `*[_type == "user" && email == $email && password == $password][0]{
      _id,
      email
    }`,
    { email, password }
  );

  // Če uporabnik ne obstaja ali je geslo napačno
  if (!user) {
    return NextResponse.json(
      { error: "Napačen email ali geslo" },
      { status: 401 }
    );
  }

  // Uspešna prijava → nastavi cookie pravilno za Vercel + HTTPS
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: "userEmail",
    value: email,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  // OBVEZNO za Vercel!
    sameSite: "lax",
    path: "/",                                      // OBVEZNO
    maxAge: 60 * 60 * 24 * 30,                      // 30 dni (lahko pustiš 7, če hočeš)
  });

  return response;
}