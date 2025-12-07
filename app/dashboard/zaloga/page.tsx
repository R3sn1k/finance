// app/dashboard/DashboardClient.tsx → KLIK NA KARTICO = POPUP Z GRAFOM!
"use client";

import { useState } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DollarSign, LogOut, Plus, X } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Transakcija = {
  _id: string;
  datum: string;
  tip: "prihodek" | "odhodek";
  znesek: number;
  opis: string;
};

type Props = {
  userEmail: string;
  username: string;
  profileImage: string | null;
  prihodki: number;
  odhodki: number;
  dobiček: number;
  steviloProdaj: number;
  transakcije: Transakcija[];
  monthlyData: Record<string, { prihodki: number; odhodki: number; prodaje: number }>;
};

export default function DashboardClient({
  userEmail,
  username,
  profileImage,
  prihodki = 0,
  odhodki = 0,
  dobiček = 0,
  steviloProdaj = 0,
  transakcije = [],
  monthlyData = {},
}: Props) {
  const [openGraph, setOpenGraph] = useState<"dobiček" | "prihodki" | "odhodki" | "prodaje" | null>(null);

  // Pripravi podatke za graf (zadnjih 12 mesecev)
  const months = Object.keys(monthlyData).sort().reverse().slice(0, 12);

  const dataDobiček = months.map(m => (monthlyData[m]?.prihodki || 0) - (monthlyData[m]?.odhodki || 0));
  const dataPrihodki = months.map(m => monthlyData[m]?.prihodki || 0);
  const dataOdhodki = months.map(m => monthlyData[m]?.odhodki || 0);
  const dataProdaje = months.map(m => monthlyData[m]?.prodaje || 0);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Finance Dresovi</h1>
          <div className="flex items-center gap-5">
            {profileImage ? (
              <Image src={profileImage} alt="Profil" width={40} height={40} className="rounded-full object-cover border-2 border-gray-300" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg">
                {username[0].toUpperCase()}
              </div>
            )}
            <span className="hidden sm:block text-gray-600 font-medium">{username}</span>
            <a href="/api/logout" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-semibold">
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Odjava</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <h2 className="text-3xl font-bold mb-12">Živjo, <span className="text-gray-700">{username}</span>!</h2>

        {/* 4 KARTICE – KLIK = GRAF POPUP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <button
            onClick={() => setOpenGraph("dobiček")}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-xl transition transform hover:scale-105 text-left"
          >
            <p className="text-sm font-medium text-gray-500 mb-2">Dobiček</p>
            <p className={`text-4xl font-bold ${dobiček >= 0 ? "text-green-600" : "text-red-600"}`}>
              {(dobiček ?? 0).toFixed(2).replace(".", ",")} €
            </p>
          </button>

          <button
            onClick={() => setOpenGraph("prihodki")}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-xl transition transform hover:scale-105 text-left"
          >
            <p className="text-sm font-medium text-gray-500 mb-2">Prihodki</p>
            <p className="text-4xl font-bold text-green-600">
              {(prihodki ?? 0).toFixed(2).replace(".", ",")} €
            </p>
          </button>

          <button
            onClick={() => setOpenGraph("odhodki")}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-xl transition transform hover:scale-105 text-left"
          >
            <p className="text-sm font-medium text-gray-500 mb-2">Odhodki</p>
            <p className="text-4xl font-bold text-orange-500">
              {(odhodki ?? 0).toFixed(2).replace(".", ",")} €
            </p>
          </button>

          <button
            onClick={() => setOpenGraph("prodaje")}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-xl transition transform hover:scale-105 text-left"
          >
            <p className="text-sm font-medium text-gray-500 mb-2">Število prodaj</p>
            <p className="text-4xl font-bold text-indigo-600">{steviloProdaj}</p>
          </button>
        </div>

        {/* Tvoja tabela in ostalo – ostane kot prej */}
        {/* (kopiraj iz tvoje stare kode) */}
      </main>

      {/* POPUP Z GRAFOM – ODPRI SE OB KLIKU NA KARTICO */}
      {openGraph && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-5xl w-full relative">
            <button
              onClick={() => setOpenGraph(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 transition"
            >
              <X className="w-10 h-10" />
            </button>

            <h3 className="text-4xl font-black text-center mb-10">
              {openGraph === "dobiček" && "Dobiček po mesecih"}
              {openGraph === "prihodki" && "Prihodki po mesecih"}
              {openGraph === "odhodki" && "Odhodki po mesecih"}
              {openGraph === "prodaje" && "Število prodaj po mesecih"}
            </h3>

            <div className="h-96">
              <Line
                data={{
                  labels: months.map(m => new Date(m + "-01").toLocaleDateString("sl-SI", { month: "short", year: "numeric" })),
                  datasets: [{
                    label: "",
                    data: openGraph === "dobiček" ? dataDobiček :
                          openGraph === "prihodki" ? dataPrihodki :
                          openGraph === "odhodki" ? dataOdhodki : dataProdaje,
                    borderColor: openGraph === "dobiček" ? "#10B981" :
                                  openGraph === "prihodki" ? "#10B981" :
                                  openGraph === "odhodki" ? "#F97316" : "#6366F1",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 10,
                  }],
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}