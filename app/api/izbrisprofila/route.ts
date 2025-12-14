// app/api/izbrisi-profil/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("userEmail")?.value;

    console.log("🍪 userEmail iz cookie-ja:", userEmail); // ← DEBUG

    if (!userEmail) {
      return NextResponse.json({ error: "Ni prijavljen." }, { status: 401 });
    }

    // Poišči uporabnika
    const user = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]{ _id, email, username }`,
      { email: userEmail }
    );

    console.log("👤 Najden uporabnik:", user); // ← DEBUG

    if (!user) {
      return NextResponse.json({ error: "Uporabnik ne obstaja." }, { status: 404 });
    }

    // Izbriši transakcije
    console.log("🗑️ Brišem transakcije za:", userEmail);
    await writeClient.delete({
      query: `*[_type == "transakcija" && userEmail == $email]`,
      params: { email: userEmail },
    });

    // Izbriši uporabnika
    console.log("🗑️ Brišem uporabnika z _id:", user._id);
    await writeClient.delete(user._id);

    // Počisti cookie-je
    const response = NextResponse.json({ success: true });
    response.cookies.set("userEmail", "", { path: "/", maxAge: 0 });
    response.cookies.set("username", "", { path: "/", maxAge: 0 });

    console.log("✅ Profil uspešno izbrisan");
    return response;

  } catch (error: any) {
    console.error("💥 Napaka pri brisanju profila:", error);
    console.error("💥 Error message:", error.message);
    console.error("💥 Error stack:", error.stack);
    return NextResponse.json({ error: "Napaka na strežniku." }, { status: 500 });
  }
}