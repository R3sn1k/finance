import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

type DresDoc = {
  _id: string;
  _type: "dres";
  userEmail?: string;
  ime?: string;
  cenaProdaje?: number;
  zaloga?: number;
  status?: string;
};

export async function POST(req: Request) {
  const userEmail = (await cookies()).get("userEmail")?.value;
  if (!userEmail) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  const { dresId, kolicina = 1, opis } = await req.json();
  if (!dresId || typeof dresId !== "string") {
    return NextResponse.json({ error: "Manjka ID dresa." }, { status: 400 });
  }

  const dres = (await writeClient.getDocument(dresId)) as DresDoc | null;

  if (!dres || dres._type !== "dres" || dres.userEmail !== userEmail) {
    return NextResponse.json({ error: "Dres ne obstaja ali nimaš pravic." }, { status: 404 });
  }

  if (dres.status === "prodan") {
    return NextResponse.json({ error: "Dres je že označen kot prodan." }, { status: 400 });
  }

  const cenaProdaje = Number(dres.cenaProdaje || 0);
  const zaloga = Math.max(0, Math.floor(Number(dres.zaloga || 0)));
  const prodanaKolicina = Math.floor(Number(kolicina));
  const ime = dres.ime || "Dres";
  const datum = new Date().toISOString();
  const opisTransakcije = typeof opis === "string" && opis.trim()
    ? opis.trim()
    : prodanaKolicina > 1
      ? `Prodaja ${prodanaKolicina}x dresa - ${ime}`
      : `Prodaja dresa - ${ime}`;

  if (!Number.isFinite(prodanaKolicina) || prodanaKolicina < 1) {
    return NextResponse.json({ error: "Količina prodaje mora biti vsaj 1." }, { status: 400 });
  }

  if (zaloga < 1) {
    return NextResponse.json({ error: "Ta dres nima zaloge." }, { status: 400 });
  }

  if (prodanaKolicina > zaloga) {
    return NextResponse.json({ error: `Na zalogi je samo ${zaloga} kosov.` }, { status: 400 });
  }

  const novaZaloga = zaloga - prodanaKolicina;
  const znesek = cenaProdaje * prodanaKolicina;

  await writeClient
    .transaction()
    .patch(dresId, (patch) => patch.set({ status: novaZaloga === 0 ? "prodan" : "na_zalogi", zaloga: novaZaloga }))
    .create({
      _type: "prodaja",
      userEmail,
      dres: { _type: "reference", _ref: dresId },
      cenaProdaje: znesek,
      kolicina: prodanaKolicina,
      opomba: opisTransakcije,
      datum,
    })
    .create({
      _type: "transakcija",
      userEmail,
      tip: "prihodek",
      znesek,
      opis: opisTransakcije,
      datum,
    })
    .commit();

  return NextResponse.json({ success: true });
}
