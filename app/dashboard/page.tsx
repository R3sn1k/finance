// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { writeClient } from "@/sanity/lib/client";
import DashboardClient from "./DashboardClient";
import Link from "next/link";

export const revalidate = 0;

export default async function DashboardPage() {
  const userEmail = (await cookies()).get("userEmail")?.value ?? "neznan";

  // ╔══════════════════════════════════════════════════════════╗
  // ║    NOVI PODATKI – iz tabele "transakcija"                ║
  // ╚══════════════════════════════════════════════════════════╝

  const finance = await writeClient.fetch(
    `*[_type == "transakcija" && userEmail == $userEmail] {
      tip,
      znesek
    }`,
    { userEmail }
  );

  const prihodki = finance
    .filter((t: any) => t.tip === "prihodek")
    .reduce((sum: number, t: any) => sum + t.znesek, 0);

  const odhodki = finance
    .filter((t: any) => t.tip === "odhodek")
    .reduce((sum: number, t: any) => sum + t.znesek, 0);

  const dobiček = prihodki - odhodki;

  // ╔══════════════════════════════════════════════════════════╗
  // ║    STARI PODATKI – če jih še rabiš iz prodaj (po želji)  ║
  // ╚══════════════════════════════════════════════════════════╝

  const prodaje = await writeClient.fetch(
    `count(*[_type == "prodaja" && userEmail == $userEmail])`,
    { userEmail }
  );

  return (
    <DashboardClient
      userEmail={userEmail}
      prihodki={prihodki}
      odhodki={odhodki}
      dobiček={dobiček}
      steviloProdaj={prodaje}
    />
  );
}