import { NextRequest, NextResponse } from "next/server";
import { client } from "../../../lib/sanity";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Poiščemo uporabnika po emailu
  const query = `*[_type == "user" && email == $email][0]`;
  const user = await client.fetch(query, { email });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ message: "Logged in" });
  // Shranimo user ID v cookie
  res.cookies.set("session", user._id, { path: "/", maxAge: 60 * 60 * 24 * 7 }); // 7 dni
  return res;
}
