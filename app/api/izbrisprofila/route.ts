// app/api/delete-account/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { cookies } from "next/headers";

export async function POST() {
  const userEmail = (await cookies()).get("userEmail")?.value;
  if (!userEmail) return NextResponse.json({ error: "Ni prijavljen" }, { status: 401 });

  try {
    const user = await writeClient.fetch(`*[_type == "user" && email == $email][0]._id`, { email: userEmail });
    if (user) await writeClient.delete(user);

    const response = NextResponse.json({ success: true });
    response.cookies.delete("userEmail");
    response.cookies.delete("username");
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Napaka pri brisanju" }, { status: 500 });
  }
}