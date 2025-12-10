// app/api/urejanjeprofila/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const userEmail = (await cookies()).get("userEmail")?.value;
  if (!userEmail) return NextResponse.json({ error: "Ni prijavljen" }, { status: 401 });

  const formData = await req.formData();

  const username = formData.get("username")?.toString().trim();
  const oldPassword = formData.get("oldPassword")?.toString();
  const newPassword = formData.get("newPassword")?.toString();
  const letniCiljDobickaStr = formData.get("letniCiljDobicka")?.toString();
  const image = formData.get("image") as File | null;

  try {
    const user = await writeClient.fetch(`*[_type == "user" && email == $email][0]`, { email: userEmail });
    if (!user) return NextResponse.json({ error: "Uporabnik ne obstaja" }, { status: 404 });

    // Če spreminja geslo → preveri starega
    if (newPassword) {
      if (!oldPassword || !bcrypt.compareSync(oldPassword, user.password)) {
        return NextResponse.json({ error: "Napačno staro geslo" }, { status: 400 });
      }
    }

    const updates: any = {};

    if (username && username !== user.username) updates.username = username;
    if (newPassword) updates.password = bcrypt.hashSync(newPassword, 10);

    // SHRANI LETNI CILJ DOBIČKA
    if (letniCiljDobickaStr && !isNaN(Number(letniCiljDobickaStr))) {
      const novCilj = Number(letniCiljDobickaStr);
      if (novCilj !== user.letniCiljDobicka) {
        updates.letniCiljDobicka = novCilj;
      }
    }

    // Upload slike (če je)
    if (image && image.size > 0) {
      const imageAsset = await writeClient.assets.upload("image", image);
      updates.profileImage = {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      };
    }

    // Shrani v Sanity
    await writeClient.patch(user._id).set(updates).commit();

    // Vrni posodobljene podatke
    return NextResponse.json({
      success: true,
      username: username || user.username,
      profileImage: image ? URL.createObjectURL(image) : user.profileImage?.asset?.url || null,
    });
  } catch (err) {
    console.error("Napaka pri urejanju profila:", err);
    return NextResponse.json({ error: "Napaka na strežniku" }, { status: 500 });
  }
}