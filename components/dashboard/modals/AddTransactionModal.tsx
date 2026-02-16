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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Nova transakcija</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          <select
            value={tip}
            onChange={(e) => setTip(e.target.value as any)}
            className="w-full p-4 rounded-lg border border-gray-300"
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
            className="w-full p-4 rounded-lg border border-gray-300"
          />

          <input
            type="text"
            placeholder="Opis"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-300"
          />
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button onClick={onClose} className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">
            Prekliči
          </button>
          <button onClick={onSave} className="px-10 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-semibold">
            Shrani
          </button>
        </div>
      </div>
    </div>
  );
}
