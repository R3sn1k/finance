"use client";

import { X } from "lucide-react";
import { Line } from "react-chartjs-2";
import type { GraphType } from "../../../types/dashboard";
import { GRAPH_META, chartOptions } from "../../../lib/chart";

type Props = {
  openGraph: GraphType | null;
  onClose: () => void;

  selectedYear: number;
  setSelectedYear: (y: number) => void;
  availableYears: number[];

  chartData: any; // ChartJS tip lahko kasneje izboljšamo
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      {/* Modal container */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-5xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Title + year selector */}
        <div className="flex flex-col gap-4 mb-6">
          <h3 className="text-2xl sm:text-3xl font-black text-center">
            {GRAPH_META[openGraph].label} po mesecih
          </h3>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="mx-auto px-5 py-3 border border-gray-300 rounded-lg text-base font-medium bg-white shadow-sm"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Chart */}
        <div className="h-64 sm:h-96">
          <Line data={chartData} options={chartOptions as any} />
        </div>
      </div>
    </div>
  );
}
