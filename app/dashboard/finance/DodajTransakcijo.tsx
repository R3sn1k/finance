// app/dashboard/finance/DodajTransakcijo.tsx
"use client";

import { useState } from "react";

export default function DodajTransakcijo() {
  const [tip, setTip] = useState<"prihodek" | "odhodek">("prihodek");
  const [znesek, setZnesek] = useState("");
  const [opis, setOpis] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/dodaj-transakcijo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tip, znesek: Number(znesek), opis }),
    });
    setZnesek("");
    setOpis("");
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select value={tip} onChange={(e) => setTip(e.target.value as any)} className="p-4 rounded-xl bg-white/20 text-white">
          <option value="prihodek">Prihodek</option>
          <option value="odhodek">Odhodek</option>
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Znesek (€)"
          value={znesek}
          onChange={(e) => setZnesek(e.target.value)}
          required
          className="p-4 rounded-xl bg-white/20 text-white placeholder-white/70"
        />
        <input
          type="text"
          placeholder="Opis (npr. Prodaja dresa, Poštnina...)"
          value={opis}
          onChange={(e) => setOpis(e.target.value)}
          required
          className="p-4 rounded-xl bg-white/20 text-white placeholder-white/70 md:col-span-1"
        />
        <button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-bold py-4 rounded-xl transition transform hover:scale-105">
          Dodaj
        </button>
      </div>
    </form>
  );
}