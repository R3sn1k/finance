// app/api/register/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
// bcrypt ni več potreben → odstranjen import

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

    // Shrani uporabnika z navadnim geslom (BREZ hashinga)
    await writeClient.create({
      _type: "user",
      username: username.trim(),
      email: email.trim(),
      password: password.trim(), // ← plain text geslo
      // Če imaš letni cilj z initialValue v schemi, ga ni treba podajat tukaj
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Registracija napaka:", error);
    console.error("Error message:", error.message);
    return NextResponse.json(
      { error: "Napaka na strežniku." },
      { status: 500 }
    );
  }
}