// app/api/update-profile/route.ts → TO JE PRAVILNA VERZIJA!
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const userEmail = (await cookies()).get("userEmail")?.value;
  if (!userEmail) return NextResponse.json({ error: "Ni prijavljen" }, { status: 401 });

  const formData = await req.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string | null;
  const image = formData.get("image") as File | null;

  try {
    // Najdi uporabnika
    const user = await writeClient.fetch(`*[_type == "user" && email == $email][0]._id`, { email: userEmail });
    if (!user) return NextResponse.json({ error: "Uporabnik ne obstaja" }, { status: 404 });

    // Pripravi patch
    const patch = writeClient.patch(user);

    if (username) patch.set({ username });
    if (password) patch.set({ password });

    if (image && image.size > 0) {
      const uploaded = await writeClient.assets.upload("image", image);
      patch.set({
        profileImage: {
          _type: "image",
          asset: { _type: "reference", _ref: uploaded._id },
        },
      });
    }

    await patch.commit();

    // Posodobi cookie z novim username-om
    const response = NextResponse.json({ success: true });
    if (username) {
      response.cookies.set("username", username, {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Napaka pri shranjevanju" }, { status: 500 });
  }
}