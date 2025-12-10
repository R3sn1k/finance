// app/api/izbrisi-transakcijo/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { transakcijaId } = await req.json();

    if (!transakcijaId) {
      return NextResponse.json({ error: "Manjka ID." }, { status: 400 });
    }

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

    // Preveri, da transakcija pripada uporabniku
    const exists = await writeClient.fetch(
      `*[_type == "transakcija" && _id == $id && user._ref == $userId][0]._id`,
      { id: transakcijaId, userId }
    );

    if (!exists) {
      return NextResponse.json({ error: "Transakcija ne obstaja ali nimaš pravic." }, { status: 403 });
    }

    // IZBRIŠI
    await writeClient.delete(transakcijaId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Brisanje transakcije napaka:", error);
    return NextResponse.json({ error: "Napaka na strežniku." }, { status: 500 });
  }
}