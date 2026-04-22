"use client";

import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  tip: "prihodek" | "odhodek";
  setTip: (v: "prihodek" | "odhodek") => void;
  znesek: string;
  setZnesek: (v: string) => void;
  opis: string;
  setOpis: (v: string) => void;
  onSave: () => void;
};

export default function AddTransactionModal({
  open,
  onClose,
  tip,
  setTip,
  znesek,
  setZnesek,
  opis,
  setOpis,
  onSave,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Nova transakcija</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          <select
            value={tip}
            onChange={(e) => setTip(e.target.value as "prihodek" | "odhodek")}
            className="dark-field w-full p-4 rounded-xl"
          >
            <option value="prihodek">Prihodek</option>
            <option value="odhodek">Odhodek</option>
          </select>

          <input
            type="number"
            step="0.01"
            placeholder="Znesek (€)"
            value={znesek}
            onChange={(e) => setZnesek(e.target.value)}
            className="dark-field w-full p-4 rounded-xl"
          />

          <input
            type="text"
            placeholder="Opis"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            className="dark-field w-full p-4 rounded-xl"
          />
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/15 text-slate-100 rounded-xl font-semibold">
            Prekliči
          </button>
          <button onClick={onSave} className="primary-action px-10 py-3 rounded-xl font-semibold">
            Shrani
          </button>
        </div>
      </div>
    </div>
  );
}
