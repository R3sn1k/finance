// app/api/register/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12; // Višje = varneje, 12 je standard

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    // Validacija na strežniku
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Manjkajo obvezni podatki." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Geslo mora imeti vsaj 6 znakov." },
        { status: 400 }
      );
    }

    // Preveri, če uporabnik že obstaja
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

    // HAŠIRAJ GESLO
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Shrani uporabnika z haširanim geslom
    await writeClient.create({
      _type: "user",
      username,
      email,
      password: hashedPassword, // ← haširano!
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registracija napaka:", error);
    return NextResponse.json(
      { error: "Napaka na strežniku." },
      { status: 500 }
    );
  }
}