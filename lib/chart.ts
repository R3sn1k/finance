import type { GraphType, MonthlyData } from "@/types/dashboard";

export const GRAPH_META: Record<GraphType, { label: string; border: string; bg: string }> = {
  dobiček: { label: "Dobiček", border: "#10B981", bg: "rgba(16,185,129,0.1)" },
  prihodki: { label: "Prihodki", border: "#10B981", bg: "rgba(16,185,129,0.1)" },
  odhodki: { label: "Odhodki", border: "#F97316", bg: "rgba(249,115,22,0.1)" },
  prodaje: { label: "Prodaje", border: "#6366F1", bg: "rgba(99,102,241,0.1)" },
};

export function getDataForYear(params: {
  type: GraphType;
  months: string[]; // ["2026-01", ...]
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

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { ticks: { maxRotation: 0, minRotation: 0 } } },
} as const;
