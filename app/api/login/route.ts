// app/api/login/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Osnovna validacija
    if (!email || !password) {
      return NextResponse.json(
        { error: "Manjkata email in geslo" },
        { status: 400 }
      );
    }

    // Poišči uporabnika SAMO po emailu
    const user = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]{
        _id,
        email,
        username,
        password  // potrebujemo geslo za primerjavo
      }`,
      { email: email.trim() }
    );

    // Če uporabnik ne obstaja
    if (!user) {
      return NextResponse.json(
        { error: "Napačen email ali geslo" },
        { status: 401 }
      );
    }

    // Primerjaj geslo direktno (plain text)
    if (user.password !== password.trim()) {
      return NextResponse.json(
        { error: "Napačen email ali geslo" },
        { status: 401 }
      );
    }

    // Uspešna prijava
    const response = NextResponse.json({ success: true });

    // Cookie za email (za stare funkcionalnosti)
    response.cookies.set({
      name: "userEmail",
      value: user.email,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 dni
    });

    // Cookie za username (za prikaz na dashboardu)
    response.cookies.set({
      name: "username",
      value: user.username || user.email.split("@")[0],
      httpOnly: false, // da ga lahko bereš iz JS na frontendu
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    console.error("Napaka pri prijavi:", error);
    return NextResponse.json(
      { error: "Napaka na strežniku" },
      { status: 500 }
    );
  }
}