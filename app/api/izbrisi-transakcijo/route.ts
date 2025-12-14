// app/api/izbrisi-transakcijo/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  console.log("🚀 /api/izbrisi-transakcijo KLICAN!");

  try {
    const body = await req.json();
    const { transakcijaId } = body;

    console.log("📥 Prejet transakcijaId:", transakcijaId);

    if (!transakcijaId) {
      return NextResponse.json({ error: "Manjka ID transakcije" }, { status: 400 });
    }

    // Preveri prijavo (userEmail cookie)
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("userEmail")?.value;

    console.log("🍪 userEmail iz cookie:", userEmail || "NI PRIJAVE");

    if (!userEmail) {
      return NextResponse.json({ error: "Ni prijavljen" }, { status: 401 });
    }

    // Preveri, če transakcija pripada temu uporabniku (varnost!)
    const transakcija = await writeClient.fetch(
      `*[_type == "transakcija" && _id == $id && userEmail == $email][0]`,
      { id: transakcijaId, email: userEmail }
    );

    if (!transakcija) {
      console.log("❌ Transakcija ne obstaja ali ne pripada uporabniku");
      return NextResponse.json({ error: "Transakcija ne obstaja" }, { status: 404 });
    }

    // Izbriši transakcijo
    console.log("🗑️ Brišem transakcijo z ID:", transakcijaId);
    await writeClient.delete(transakcijaId);

    console.log("✅ Transakcija uspešno izbrisana");
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("💥 Napaka pri brisanju transakcije:", error);
    console.error("💥 Message:", error.message);
    return NextResponse.json({ error: "Napaka na strežniku" }, { status: 500 });
  }
}