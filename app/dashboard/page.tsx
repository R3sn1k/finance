// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { writeClient } from "@/sanity/lib/client";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

export default async function DashboardPage() {
  const userEmail = (await cookies()).get("userEmail")?.value || "neznan";

  const user = await writeClient.fetch(
    `*[_type == "user" && email == $email][0]{
      _id,
      username,
      "profileImage": profileImage.asset->url,
      letniCiljDobicka
    }`,
    { email: userEmail }
  );

  const transakcije = await writeClient.fetch(
    `*[_type == "transakcija" && userEmail == $userEmail] | order(datum desc) {
      _id, datum, tip, znesek, opis
    }`,
    { userEmail }
  );

  const monthlyData = transakcije.reduce((acc: any, t: any) => {
    const month = t.datum.slice(0, 7);
    if (!acc[month]) acc[month] = { prihodki: 0, odhodki: 0, prodaje: 0 };
    if (t.tip === "prihodek") {
      acc[month].prihodki += t.znesek;
      acc[month].prodaje += 1;
    } else {
      acc[month].odhodki += t.znesek;
    }
    return acc;
  }, {});

  const prihodki = transakcije
    .filter((t: any) => t.tip === "prihodek")
    .reduce((s: number, t: any) => s + t.znesek, 0);

  const odhodki = transakcije
    .filter((t: any) => t.tip === "odhodek")
    .reduce((s: number, t: any) => s + t.znesek, 0);

  const dobiček = prihodki - odhodki;
  const steviloProdaj = transakcije.filter((t: any) => t.tip === "prihodek").length;

  return (
    <DashboardClient
      userEmail={userEmail}
      username={user?.username || userEmail.split("@")[0]}
      profileImage={user?.profileImage || null}
      prihodki={prihodki}
      odhodki={odhodki}
      dobiček={dobiček}
      steviloProdaj={steviloProdaj}
      transakcije={transakcije}
      monthlyData={monthlyData}
      letniCiljDobicka={user?.letniCiljDobicka || 25000}   // ← TUKAJ POŠLJEMO CILJ
    />
  );
}