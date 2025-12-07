// app/api/dodaj-transakcijo/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const userEmail = (await cookies()).get("userEmail")?.value || "neznan";
  const { tip, znesek, opis } = await req.json();

  await writeClient.create({
    _type: "transakcija",
    userEmail,
    tip,
    znesek,
    opis,
    datum: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}