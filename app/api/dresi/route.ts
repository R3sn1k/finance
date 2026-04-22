import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

const allowedStatuses = new Set(["v_prihodu", "na_zalogi", "prodan"]);

type DresDoc = {
  _id: string;
  _type: "dres";
  userEmail?: string;
  ime?: string;
  cenaProdaje?: number;
  zaloga?: number;
  status?: string;
};

async function getUserEmail() {
  const userEmail = (await cookies()).get("userEmail")?.value;
  if (!userEmail) {
    throw new Error("Niste prijavljeni.");
  }
  return userEmail;
}

async function getOwnedDres(dresId: string, userEmail: string) {
  const dres = (await writeClient.getDocument(dresId)) as DresDoc | null;
  if (!dres || dres._type !== "dres" || dres.userEmail !== userEmail) {
    return null;
  }
  return dres;
}

export async function POST(req: Request) {
  let userEmail: string;
  try {
    userEmail = await getUserEmail();
  } catch {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  const formData = await req.formData();
  const ime = String(formData.get("ime") || "").trim();
  const cenaProdaje = Number(formData.get("cenaProdaje"));
  const kolicina = Math.floor(Number(formData.get("kolicina") || 1));
  const status = String(formData.get("status") || "na_zalogi");
  const slika = formData.get("slika");

  if (!ime) {
    return NextResponse.json({ error: "Vnesi ime dresa." }, { status: 400 });
  }

  if (!Number.isFinite(cenaProdaje) || cenaProdaje < 0) {
    return NextResponse.json({ error: "Vnesi veljavno prodajno ceno." }, { status: 400 });
  }

  if (!Number.isFinite(kolicina) || kolicina < 1) {
    return NextResponse.json({ error: "Količina mora biti vsaj 1." }, { status: 400 });
  }

  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Neveljaven status dresa." }, { status: 400 });
  }

  let imageRef: { _type: "image"; asset: { _type: "reference"; _ref: string } } | undefined;

  if (slika instanceof File && slika.size > 0) {
    const buffer = Buffer.from(await slika.arrayBuffer());
    const imageAsset = await writeClient.assets.upload("image", buffer, {
      filename: `${crypto.randomUUID()}-${slika.name}`,
      contentType: slika.type || "image/jpeg",
    });

    imageRef = {
      _type: "image",
      asset: { _type: "reference", _ref: imageAsset._id },
    };
  }

  const dres = await writeClient.create({
    _type: "dres",
    userEmail,
    ime,
    cenaProdaje,
    status,
    zaloga: status === "prodan" ? 0 : kolicina,
    ...(imageRef ? { slika: imageRef } : {}),
  });

  if (status === "prodan") {
    const datum = new Date().toISOString();
    const znesek = cenaProdaje * kolicina;
    await writeClient
      .transaction()
      .create({
        _type: "prodaja",
        userEmail,
        dres: { _type: "reference", _ref: dres._id },
        cenaProdaje: znesek,
        kolicina,
        opomba: `Prodaja - ${ime}`,
        datum,
      })
      .create({
        _type: "transakcija",
        userEmail,
        tip: "prihodek",
        znesek,
        opis: kolicina > 1 ? `Prodaja ${kolicina}x dresa - ${ime}` : `Prodaja dresa - ${ime}`,
        datum,
      })
      .commit();
  }

  return NextResponse.json({ success: true, dresId: dres._id });
}

export async function PUT(req: Request) {
  let userEmail: string;
  try {
    userEmail = await getUserEmail();
  } catch {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  const { dresId, status, kolicina = 1, opis } = await req.json();

  if (!dresId || typeof dresId !== "string") {
    return NextResponse.json({ error: "Manjka ID dresa." }, { status: 400 });
  }

  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Neveljaven status dresa." }, { status: 400 });
  }

  const dres = await getOwnedDres(dresId, userEmail);
  if (!dres) {
    return NextResponse.json({ error: "Dres ne obstaja ali nimaš pravic." }, { status: 404 });
  }

  if (dres.status === "prodan") {
    return NextResponse.json({ error: "Prodanega dresa ni mogoče ponovno spreminjati." }, { status: 400 });
  }

  if (status === "prodan") {
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

  await writeClient.patch(dresId).set({ status, zaloga: Math.max(1, Number(dres.zaloga || 1)) }).commit();

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  let userEmail: string;
  try {
    userEmail = await getUserEmail();
  } catch {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  let body: { dresId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Manjka ID dresa." }, { status: 400 });
  }

  const { dresId } = body;

  if (!dresId || typeof dresId !== "string") {
    return NextResponse.json({ error: "Manjka ID dresa." }, { status: 400 });
  }

  const dres = await getOwnedDres(dresId, userEmail);
  if (!dres) {
    return NextResponse.json({ error: "Dres ne obstaja ali nimaš pravic." }, { status: 404 });
  }

  await writeClient.patch(dresId).set({ status: "prodan", zaloga: 0 }).commit();

  return NextResponse.json({ success: true });
}
