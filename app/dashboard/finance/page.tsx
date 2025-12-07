// app/dashboard/finance/page.tsx
import { writeClient } from "@/sanity/lib/client";
import { cookies } from "next/headers";
import DodajTransakcijo from "./DodajTransakcijo";
import TabelaTransakcij from "./TabelaTransakcij";

export const revalidate = 0;

export default async function FinancePage() {
  const userEmail = (await cookies()).get("userEmail")?.value || "neznan";

  const transakcije = await writeClient.fetch(
    `*[_type == "transakcija" && userEmail == $userEmail] | order(datum desc) {
      _id,
      datum,
      tip,
      znesek,
      opis
    }`,
    { userEmail }
  );

  const prihodki = transakcije
    .filter((t: any) => t.tip === "prihodek")
    .reduce((sum: number, t: any) => sum + t.znesek, 0);

  const odhodki = transakcije
    .filter((t: any) => t.tip === "odhodek")
    .reduce((sum: number, t: any) => sum + t.znesek, 0);

  const dobiček = prihodki - odhodki;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-10">Finance & Dobiček</h1>

        {/* Dodajanje */}
        <DodajTransakcijo />

        {/* Kartice s povzetkom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          <div className="bg-emerald-600/30 backdrop-blur p-8 rounded-3xl text-center border border-emerald-400/50">
            <p className="text-2xl opacity-90">Prihodki</p>
            <p className="text-6xl font-extrabold mt-4">{prihodki.toFixed(2)} €</p>
          </div>
          <div className="bg-red-600/30 backdrop-blur p-8 rounded-3xl text-center border border-red-400/50">
            <p className="text-2xl opacity-90">Odhodki</p>
            <p className="text-6xl font-extrabold mt-4">{odhodki.toFixed(2)} €</p>
          </div>
          <div className={`backdrop-blur p-8 rounded-3xl text-center border ${dobiček >= 0 ? "bg-emerald-600/50 border-emerald-300" : "bg-red-600/50 border-red-300"}`}>
            <p className="text-2xl opacity-90">Dobiček</p>
            <p className={`text-7xl font-extrabold mt-4 ${dobiček >= 0 ? "text-emerald-300" : "text-red-300"}`}>
              {dobiček.toFixed(2)} €
            </p>
          </div>
        </div>

        {/* Tabela */}
        <TabelaTransakcij transakcije={transakcije} />
      </div>
    </div>
  );
}