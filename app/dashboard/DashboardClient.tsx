// app/dashboard/DashboardClient.tsx
"use client";

import Link from "next/link";
import { DollarSign, LogOut } from "lucide-react";

type Props = {
  userEmail: string;
  prihodki?: number;
  odhodki?: number;
  dobiček?: number;
  steviloProdaj?: number;
};

export default function DashboardClient({
  userEmail,
  prihodki = 0,
  odhodki = 0,
  dobiček = 0,
  steviloProdaj = 0,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">

      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Finance Dresovi</h1>

          <div className="flex items-center gap-5">
            <span className="hidden sm:block text-gray-600 font-medium">{userEmail}</span>

            <a
              href="/api/logout"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-semibold"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Odjava</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">

        <h2 className="text-3xl font-bold mb-12">
          Živjo, <span className="text-gray-700">{userEmail.split("@")[0]}</span>!
        </h2>

        {/* GRID KARTIC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* DOBIČEK */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Dobiček</p>

            <div className="flex items-baseline gap-1">
              <span
                className={`text-4xl font-bold ${
                  dobiček >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {dobiček.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-xl font-semibold text-gray-700">€</span>
            </div>
          </div>

          {/* PRIHODKI */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 font-medium mb-2">Prihodki</p>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-green-600">
                {prihodki.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-xl font-semibold text-gray-700">€</span>
            </div>
          </div>

          {/* ODHODKI */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 font-medium mb-2">Odhodki</p>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-orange-500">
                {odhodki.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-xl font-semibold text-gray-700">€</span>
            </div>
          </div>

          {/* ŠT. PRODAJ */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 font-medium mb-2">Število prodaj</p>

            <div className="text-4xl font-bold text-gray-700">
              {steviloProdaj}
            </div>
          </div>

        </div>

        {/* GUMB */}
        <div className="mt-12">
          <Link
            href="/dashboard/finance"
            className="inline-flex items-center gap-3 px-6 py-4 bg-gray-900 text-white font-semibold rounded-lg shadow hover:bg-black transition"
          >
            <DollarSign className="w-5 h-5" />
            Finance & Transakcije
          </Link>
        </div>
      </main>
    </div>
  );
}
