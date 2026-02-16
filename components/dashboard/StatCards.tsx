"use client";

import type { GraphType } from "@/types/dashboard";
import { formatMoney } from "@/lib/format";

type Props = {
  dobiček: number;
  prihodki: number;
  odhodki: number;
  steviloProdaj: number;
  onOpenGraph: (t: GraphType) => void;
};

export default function StatCards({
  dobiček,
  prihodki,
  odhodki,
  steviloProdaj,
  onOpenGraph,
}: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {/* Profit */}
      <button
        onClick={() => onOpenGraph("dobiček")}
        className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition text-left"
      >
        <p className="text-xs sm:text-sm text-gray-500 mb-1">Dobiček</p>
        <p className={`text-2xl sm:text-3xl font-bold ${dobiček >= 0 ? "text-green-600" : "text-red-600"}`}>
          {formatMoney(dobiček)} €
        </p>
      </button>

      {/* Income */}
      <button
        onClick={() => onOpenGraph("prihodki")}
        className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition text-left"
      >
        <p className="text-xs sm:text-sm text-gray-500 mb-1">Prihodki</p>
        <p className="text-2xl sm:text-3xl font-bold text-green-600">{formatMoney(prihodki)} €</p>
      </button>

      {/* Expenses */}
      <button
        onClick={() => onOpenGraph("odhodki")}
        className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition text-left"
      >
        <p className="text-xs sm:text-sm text-gray-500 mb-1">Odhodki</p>
        <p className="text-2xl sm:text-3xl font-bold text-orange-500">{formatMoney(odhodki)} €</p>
      </button>

      {/* Sales count */}
      <button
        onClick={() => onOpenGraph("prodaje")}
        className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition text-left"
      >
        <p className="text-xs sm:text-sm text-gray-500 mb-1">Število prodaj</p>
        <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{steviloProdaj}</p>
      </button>
    </div>
  );
}
