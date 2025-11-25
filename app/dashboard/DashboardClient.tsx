// app/dashboard/DashboardClient.tsx
"use client";

import { useState } from "react";
import { LogOut, Plus, Shirt, ShoppingCart } from "lucide-react";
import { dodajDres, dodajProdajo } from "./actions";
import Link from "next/link";

type Props = {
  userEmail: string;
  prihodkiSkupaj: number;
  prihodkiTaMesec: number;
  odhodkiSkupaj: number;
  odhodkiTaMesec: number;
  steviloProdaj: number;
};

export default function DashboardClient({
  userEmail,
  prihodkiSkupaj,
  prihodkiTaMesec,
  odhodkiSkupaj,
  odhodkiTaMesec,
  steviloProdaj,
}: Props) {
  const [openDres, setOpenDres] = useState(false);
  const [openProdaja, setOpenProdaja] = useState(false);

  const trenutnoStanje = prihodkiSkupaj - odhodkiSkupaj;
  const profitTaMesec = prihodkiTaMesec - odhodkiTaMesec;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold">Finance Dresovi</h1>
          <div className="flex items-center gap-6">
            <span className="hidden sm:block text-white/90 font-medium">{userEmail}</span>
            <a href="/api/logout" className="flex items-center gap-2 text-red-300 hover:text-red-200 transition">
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Odjava</span>
            </a>
          </div>
        </div>
      </header>

      {/* Glavni del */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
              Živjo, {userEmail.split("@")[0]}!
            </h2>
            <p className="text-xl text-white/80">Tukaj upravljaš svoj posel z dresi</p>
          </div>

          {/* TRIJE GUMBI */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
            <button onClick={() => setOpenDres(true)} className="group flex items-center justify-center gap-4 bg-white/20 backdrop-blur-lg hover:bg-white/30 border border-white/30 text-white font-bold text-2xl px-12 py-8 rounded-3xl shadow-2xl transition-all transform hover:scale-105">
              <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform" />
              Dodaj nov dres
            </button>

            <button onClick={() => setOpenProdaja(true)} className="group flex items-center justify-center gap-4 bg-white/20 backdrop-blur-lg hover:bg-white/30 border border-white/30 text-white font-bold text-2xl px-12 py-8 rounded-3xl shadow-2xl transition-all transform hover:scale-105">
              <ShoppingCart className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
              Nova prodaja
            </button>

            <Link href="/dashboard/zaloga" className="group flex items-center justify-center gap-4 bg-white/20 backdrop-blur-lg hover:bg-white/30 border border-white/30 text-white font-bold text-2xl px-12 py-8 rounded-3xl shadow-2xl transition-all transform hover:scale-105">
              <Shirt className="w-10 h-10" />
              Poglej zalogo
            </Link>
          </div>

          {/* Kartice */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
              <p className="text-white/80 text-lg mb-2">Trenutno stanje</p>
              <p className="text-5xl font-extrabold">{trenutnoStanje.toFixed(2).replace(".", ",")} €</p>
              <p className="text-white/70 mt-3 text-sm">
                {profitTaMesec > 0 ? "+" : ""}{profitTaMesec.toFixed(2).replace(".", ",")} € ta mesec
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
              <p className="text-white/80 text-lg mb-2">Prihodki ta mesec</p>
              <p className="text-5xl font-extrabold text-emerald-300">{prihodkiTaMesec.toFixed(2).replace(".", ",")} €</p>
            </div>
            <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
              <p className="text-white/80 text-lg mb-2">Odhodki ta mesec</p>
              <p className="text-5xl font-extrabold text-red-300">{odhodkiTaMesec.toFixed(2).replace(".", ",")} €</p>
            </div>
            <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
              <p className="text-white/80 text-lg mb-2">Skupni profit</p>
              <p className="text-5xl font-extrabold">{trenutnoStanje.toFixed(2).replace(".", ",")} €</p>
              <p className="text-white/70 mt-3 text-sm">{steviloProdaj} prodaj</p>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: Dodaj dres s sliko */}
      {openDres && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10 max-w-3xl w-full max-h-screen overflow-y-auto">
            <h3 className="text-4xl font-extrabold text-center mb-10 flex items-center justify-center gap-4">
              <Shirt className="w-12 h-12" />
              Dodaj nov dres
            </h3>

            <form action={dodajDres} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <input name="ime" placeholder="Ime dresa" required className="w-full p-5 rounded-2xl bg-white/20 border border-white/40 placeholder-white/70 text-white text-lg focus:outline-none focus:ring-4 focus:ring-white/50" />
                  <input name="klub" placeholder="Klub" required className="w-full p-5 rounded-2xl bg-white/20 border border-white/40 placeholder-white/70 text-white text-lg focus:outline-none focus:ring-4 focus:ring-white/50" />
                  <div className="grid grid-cols-3 gap-4">
                    <input name="velikost" placeholder="Velikost" required className="p-5 rounded-2xl bg-white/20 border border-white/40 placeholder-white/70 text-white text-lg focus:outline-none focus:ring-4 focus:ring-white/50" />
                    <input name="cenaProdaje" type="number" step="0.01" placeholder="Cena (€)" required className="p-5 rounded-2xl bg-white/20 border border-white/40 placeholder-white/70 text-white text-lg focus:outline-none focus:ring-4 focus:ring-white/50" />
                    <input name="nabavnaCena" type="number" step="0.01" placeholder="Nabavna cena (€)" required className="p-5 rounded-2xl bg-white/20 border border-white/40 placeholder-white/70 text-white text-lg focus:outline-none focus:ring-4 focus:ring-white/50" />
                  </div>
                  <input name="zaloga" type="number" defaultValue="1" placeholder="Zaloga" className="w-full p-5 rounded-2xl bg-white/20 border border-white/40 placeholder-white/70 text-white text-lg focus:outline-none focus:ring-4 focus:ring-white/50" />
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-3 text-lg">Slika dresa</label>
                  <input type="file" name="slika" accept="image/*" required className="block w-full text-white file:mr-4 file:py-4 file:px-6 file:rounded-2xl file:border-0 file:text-lg file:font-semibold file:bg-white file:text-indigo-700 hover:file:bg-gray-100 cursor-pointer" />
                  <p className="text-white/60 text-sm mt-2">Priporočeno: kvadratna slika (1000×1000px)</p>
                </div>
              </div>

              <div className="flex justify-center gap-6 pt-6">
                <button type="button" onClick={() => setOpenDres(false)} className="px-10 py-4 bg-white/20 hover:bg-white/30 rounded-2xl font-bold transition">
                  Prekliči
                </button>
                <button type="submit" className="px-12 py-4 bg-white text-indigo-700 font-bold text-xl rounded-2xl shadow-lg hover:bg-gray-100 transition transform hover:scale-105">
                  Shrani dres
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nova prodaja */}
      {openProdaja && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10 max-w-2xl w-full">
            <h3 className="text-4xl font-extrabold text-center mb-10 flex items-center justify-center gap-4">
              <ShoppingCart className="w-12 h-12" />
              Nova prodaja
            </h3>

            <form action={dodajProdajo} className="space-y-6">
              <input name="cenaProdaje" type="number" step="0.01" placeholder="Cena prodaje (€)" required className="w-full p-5 rounded-2xl bg-white/20 border border-white/40 placeholder-white/70 text-white text-lg focus:outline-none focus:ring-4 focus:ring-white/50" />
              <input name="dresId" placeholder="ID dresa iz Sanity-ja" required className="w-full p-5 rounded-2xl bg-white/20 border border-white/40 placeholder-white/70 text-white text-lg focus:outline-none focus:ring-4 focus:ring-white/50" />
              <input name="opomba" placeholder="Opomba (neobvezno)" className="w-full p-5 rounded-2xl bg-white/20 border border-white/40 placeholder-white/70 text-white text-lg focus:outline-none focus:ring-4 focus:ring-white/50" />

              <div className="flex justify-center gap-6 pt-6">
                <button type="button" onClick={() => setOpenProdaja(false)} className="px-10 py-4 bg-white/20 hover:bg-white/30 rounded-2xl font-bold transition">
                  Prekliči
                </button>
                <button type="submit" className="px-12 py-4 bg-white text-indigo-700 font-bold text-xl rounded-2xl shadow-lg hover:bg-gray-100 transition transform hover:scale-105">
                  Shrani prodajo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}