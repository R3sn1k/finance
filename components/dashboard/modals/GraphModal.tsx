"use client";

import { X } from "lucide-react";
import type { ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import type { GraphType } from "../../../types/dashboard";
import { GRAPH_META, chartOptions } from "../../../lib/chart";

type Props = {
  openGraph: GraphType | null;
  onClose: () => void;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  availableYears: number[];
  chartData: ChartData<"line">;
};

export default function GraphModal({
  openGraph,
  onClose,
  selectedYear,
  setSelectedYear,
  availableYears,
  chartData,
}: Props) {
  if (!openGraph) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/85 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-5xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-slate-300 shadow-lg hover:bg-white/15 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-4 mb-6">
          <h3 className="text-2xl sm:text-3xl font-black text-center text-white">
            {GRAPH_META[openGraph].label} po mesecih
          </h3>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="dark-field mx-auto px-5 py-3 rounded-xl text-base font-medium"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="h-64 sm:h-96">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
