// app/dashboard/actions.ts
"use server";

import { writeClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";

const getUserEmail = async () => {
  const email = (await headers()).get("x-user-email");  // ← DODAJ await !!!
  if (!email) {
    throw new Error("Niste prijavljeni!");
  }
  return email;
};

// 1. DODAJ DRES
export async function dodajDres(formData: FormData) {
  const userEmail = await getUserEmail();
  const file = formData.get("slika") as File | null;

  let slikaAsset = null;
  if (file && file.size > 0) {
    slikaAsset = await writeClient.assets.upload("image", file, {
      filename: `${uuidv4()}-${file.name}`,
    });
  }

  const dres = {
    _type: "dres",
    userEmail,
    ime: formData.get("ime") as string,
    klub: formData.get("klub") as string,
    velikost: formData.get("velikost") as string,
    cenaProdaje: Number(formData.get("cenaProdaje")),
    nabavnaCena: Number(formData.get("nabavnaCena")),
    zaloga: Number(formData.get("zaloga") || 1),
    ...(slikaAsset && {
      slika: {
        _type: "image",
        asset: { _type: "reference", _ref: slikaAsset._id },
      },
    }),
  };

  await writeClient.create(dres);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/zaloga");
}

// 2. DODAJ PRODAJO (iz modalnega okna "Nova prodaja")
export async function dodajProdajo(formData: FormData) {
  const userEmail = await getUserEmail();

  const prodaja = {
    _type: "prodaja",
    userEmail,
    dres: { _type: "reference", _ref: formData.get("dresId") as string },
    cenaProdaje: Number(formData.get("cenaProdaje")),
    opomba: (formData.get("opomba") as string) || "",
    datum: new Date().toISOString(),
  };

  await writeClient.create(prodaja);
  revalidatePath("/dashboard");
}

// 3. HITRA PRODAJA IZ ZALOGE
export async function prodajDres(dresId: string, imeDresa: string) {
  const userEmail = await getUserEmail();

  const dres = await writeClient.getDocument(dresId);
  if (!dres || (dres as any).zaloga <= 0 || (dres as any).userEmail !== userEmail) {
    throw new Error("Ni zaloge ali nimaš pravic!");
  }

  const prodaja = {
    _type: "prodaja",
    userEmail,
    dres: { _type: "reference", _ref: dresId },
    cenaProdaje: (dres as any).cenaProdaje,
    opomba: `Hitra prodaja – ${imeDresa}`,
    datum: new Date().toISOString(),
  };

  await writeClient
    .transaction()
    .create(prodaja)
    .patch(dresId, p => p.set({ zaloga: (dres as any).zaloga - 1 }))
    .commit();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/zaloga");
}