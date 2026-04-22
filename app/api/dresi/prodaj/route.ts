import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

type DresDoc = {
  _id: string;
  _type: "dres";
  userEmail?: string;
  ime?: string;
  cenaProdaje?: number;
  status?: string;
};

export async function POST(req: Request) {
  const userEmail = (await cookies()).get("userEmail")?.value;
  if (!userEmail) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  const { dresId } = await req.json();
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
  const ime = dres.ime || "Dres";
  const datum = new Date().toISOString();

  await writeClient
    .transaction()
    .patch(dresId, (patch) => patch.set({ status: "prodan", zaloga: 0 }))
    .create({
      _type: "prodaja",
      userEmail,
      dres: { _type: "reference", _ref: dresId },
      cenaProdaje,
      opomba: `Prodaja - ${ime}`,
      datum,
    })
    .create({
      _type: "transakcija",
      userEmail,
      tip: "prihodek",
      znesek: cenaProdaje,
      opis: `Prodaja dresa - ${ime}`,
      datum,
    })
    .commit();

  return NextResponse.json({ success: true });
}
