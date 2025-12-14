// app/api/urejanjeprofila/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { cookies } from "next/headers";

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

    // Preverjanje starega gesla (plain text primerjava)
    if (newPassword) {
      if (!oldPassword || oldPassword !== user.password) {
        return NextResponse.json({ error: "Napačno staro geslo" }, { status: 400 });
      }
    }

    const updates: any = {};
    let newImageUrl: string | null = null; // Za shranjevanje novega URL-ja slike

    // Username
    if (username && username !== user.username) {
      updates.username = username;
    }

    // Novo geslo (plain text)
    if (newPassword) {
      updates.password = newPassword.trim();
    }

    // Letni cilj dobička
    if (letniCiljDobickaStr && !isNaN(Number(letniCiljDobickaStr))) {
      const novCilj = Number(letniCiljDobickaStr);
      if (novCilj !== user.letniCiljDobicka) {
        updates.letniCiljDobicka = novCilj;
      }
    }

    // Upload slike (če je poslana)
    if (image && image.size > 0) {
      const buffer = await image.arrayBuffer();
      const imageAsset = await writeClient.assets.upload("image", Buffer.from(buffer), {
        filename: image.name,
      });

      updates.profileImage = {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      };

      // Pridobi URL nove slike
      newImageUrl = imageAsset.url;
    }

    // Če ni nobene spremembe, vrni success brez patcha
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({
        success: true,
        username: user.username,
        profileImage: user.profileImage?.asset?.url || null,
      });
    }

    // Shrani spremembe v Sanity
    await writeClient.patch(user._id).set(updates).commit();

    // Končni URL profilne slike (nova, če je bila poslana, sicer stara)
    const finalProfileImageUrl = newImageUrl || user.profileImage?.asset?.url || null;

    return NextResponse.json({
      success: true,
      username: username || user.username,
      profileImage: finalProfileImageUrl,
    });
  } catch (err: any) {
    console.error("Napaka pri urejanju profila:", err);
    console.error("Error message:", err.message);
    return NextResponse.json({ error: "Napaka na strežniku" }, { status: 500 });
  }
}