// app/api/dodaj-transakcijo/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const userEmail = (await cookies()).get("userEmail")?.value;
  if (!userEmail) {
    return NextResponse.json({ error: "Ni prijavljen" }, { status: 401 });
  }

  const { tip, znesek, opis } = await req.json();
  const parsedZnesek = Number(znesek);

  if (!tip || (tip !== "prihodek" && tip !== "odhodek")) {
    return NextResponse.json({ error: "Neveljaven tip transakcije" }, { status: 400 });
  }
  if (!opis || !opis.toString().trim()) {
    return NextResponse.json({ error: "Opis je obvezen" }, { status: 400 });
  }
  if (!Number.isFinite(parsedZnesek) || parsedZnesek <= 0) {
    return NextResponse.json({ error: "Neveljaven znesek" }, { status: 400 });
  }

  await writeClient.create({
    _type: "transakcija",
    userEmail,
    tip,
    znesek: parsedZnesek,
    opis: opis.toString().trim(),
    datum: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
