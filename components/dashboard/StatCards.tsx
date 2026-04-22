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
      <button
        onClick={() => onOpenGraph("dobiček")}
        className="glass-panel rounded-2xl p-5 text-left transition hover:-translate-y-0.5 hover:border-teal-300/40"
      >
        <p className="text-xs sm:text-sm text-slate-400 mb-1">Dobiček</p>
        <p className={`text-2xl sm:text-3xl font-bold ${dobiček >= 0 ? "text-emerald-300" : "text-red-300"}`}>
          {formatMoney(dobiček)} €
        </p>
      </button>

      <button
        onClick={() => onOpenGraph("prihodki")}
        className="glass-panel rounded-2xl p-5 text-left transition hover:-translate-y-0.5 hover:border-teal-300/40"
      >
        <p className="text-xs sm:text-sm text-slate-400 mb-1">Prihodki</p>
        <p className="text-2xl sm:text-3xl font-bold text-emerald-300">{formatMoney(prihodki)} €</p>
      </button>

      <button
        onClick={() => onOpenGraph("odhodki")}
        className="glass-panel rounded-2xl p-5 text-left transition hover:-translate-y-0.5 hover:border-orange-300/40"
      >
        <p className="text-xs sm:text-sm text-slate-400 mb-1">Odhodki</p>
        <p className="text-2xl sm:text-3xl font-bold text-orange-300">{formatMoney(odhodki)} €</p>
      </button>

      <button
        onClick={() => onOpenGraph("prodaje")}
        className="glass-panel rounded-2xl p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-300/40"
      >
        <p className="text-xs sm:text-sm text-slate-400 mb-1">Število prodaj</p>
        <p className="text-2xl sm:text-3xl font-bold text-blue-300">{steviloProdaj}</p>
      </button>
    </div>
  );
}
