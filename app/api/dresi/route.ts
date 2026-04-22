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
  const status = String(formData.get("status") || "na_zalogi");
  const slika = formData.get("slika");

  if (!ime) {
    return NextResponse.json({ error: "Vnesi ime dresa." }, { status: 400 });
  }

  if (!Number.isFinite(cenaProdaje) || cenaProdaje < 0) {
    return NextResponse.json({ error: "Vnesi veljavno prodajno ceno." }, { status: 400 });
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
    zaloga: status === "prodan" ? 0 : 1,
    ...(imageRef ? { slika: imageRef } : {}),
  });

  if (status === "prodan") {
    const datum = new Date().toISOString();
    await writeClient
      .transaction()
      .create({
        _type: "prodaja",
        userEmail,
        dres: { _type: "reference", _ref: dres._id },
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

  const { dresId, status } = await req.json();

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

  await writeClient.patch(dresId).set({ status, zaloga: 1 }).commit();

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  let userEmail: string;
  try {
    userEmail = await getUserEmail();
  } catch {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  const { dresId } = await req.json();

  if (!dresId || typeof dresId !== "string") {
    return NextResponse.json({ error: "Manjka ID dresa." }, { status: 400 });
  }

  const dres = await getOwnedDres(dresId, userEmail);
  if (!dres) {
    return NextResponse.json({ error: "Dres ne obstaja ali nimaš pravic." }, { status: 404 });
  }

  await writeClient.delete(dresId);

  return NextResponse.json({ success: true });
}
