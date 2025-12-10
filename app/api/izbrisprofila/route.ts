// app/api/izbrisi-profil/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // POPRAVEK: await cookies()!
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("finance-dresovi-session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Ni vpisan." }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json({ error: "Neveljavna seja." }, { status: 401 });
    }

    const userId = session.id;

    // Izbriši vse transakcije
    await writeClient.delete({
      query: `*[_type == "transakcija" && user._ref == $userId]`,
      params: { userId }
    });

    // Izbriši uporabnika
    await writeClient.delete(userId);

    // Pobriši cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "finance-dresovi-session",
      value: "",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Napaka pri brisanju profila:", error);
    return NextResponse.json({ error: "Napaka na strežniku." }, { status: 500 });
  }
}