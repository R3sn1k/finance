import type { ChartOptions } from "chart.js";
import type { GraphType, MonthlyData } from "@/types/dashboard";

export const GRAPH_META: Record<GraphType, { label: string; border: string; bg: string }> = {
  dobiček: { label: "Dobiček", border: "#2DD4BF", bg: "rgba(45,212,191,0.14)" },
  prihodki: { label: "Prihodki", border: "#34D399", bg: "rgba(52,211,153,0.14)" },
  odhodki: { label: "Odhodki", border: "#FDBA74", bg: "rgba(251,186,116,0.14)" },
  prodaje: { label: "Prodaje", border: "#93C5FD", bg: "rgba(147,197,253,0.14)" },
};

export function getDataForYear(params: {
  type: GraphType;
  months: string[];
  monthlyData: MonthlyData;
}) {
  const { type, months, monthlyData } = params;

  return months.map((key) => {
    const d = monthlyData[key] || { prihodki: 0, odhodki: 0, prodaje: 0 };
    if (type === "dobiček") return d.prihodki - d.odhodki;
    if (type === "prihodki") return d.prihodki;
    if (type === "odhodki") return d.odhodki;
    return d.prodaje;
  });
}

export const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { color: "rgba(148,163,184,0.12)" },
      ticks: { color: "#94A3B8", maxRotation: 0, minRotation: 0 },
    },
    y: {
      grid: { color: "rgba(148,163,184,0.12)" },
      ticks: { color: "#94A3B8" },
    },
  },
};
