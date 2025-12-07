// app/dashboard/finance/TabelaTransakcij.tsx
import React from "react";

type Transakcija = {
  _id: string;
  datum: string;
  tip: "prihodek" | "odhodek";
  znesek: number;
  opis: string;
};

export default function TabelaTransakcij({ transakcije }: { transakcije: Transakcija[] }) {
  if (transakcije.length === 0) {
    return (
      <div className="text-center text-white/70 mt-20 text-2xl">
        Še ni vnešenih transakcij
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/20">
            <tr>
              <th className="px-6 py-5 font-bold">Datum</th>
              <th className="px-6 py-5 font-bold">Tip</th>
              <th className="px-6 py-5 font-bold">Opis</th>
              <th className="px-6 py-5 font-bold text-right">Znesek</th>
            </tr>
          </thead>
          <tbody>
            {transakcije.map((t) => (
              <tr key={t._id} className="border-t border-white/10 hover:bg-white/5 transition">
                <td className="px-6 py-5">
                  {new Date(t.datum).toLocaleDateString("sl-SI")}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      t.tip === "prihodek"
                        ? "bg-emerald-600/50 text-emerald-200"
                        : "bg-red-600/50 text-red-200"
                    }`}
                  >
                    {t.tip === "prihodek" ? "↑ Prihodek" : "↓ Odhodek"}
                  </span>
                </td>
                <td className="px-6 py-5">{t.opis}</td>
                <td className={`px-6 py-5 text-right font-bold text-xl ${
                  t.tip === "prihodek" ? "text-emerald-400" : "text-red-400"
                }`}>
                  {t.tip === "prihodek" ? "+" : "−"} {t.znesek.toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}