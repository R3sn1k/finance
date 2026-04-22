"use client";

import Image from "next/image";
import { Camera, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  editUsername: string;
  setEditUsername: (v: string) => void;
  oldPassword: string;
  setOldPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  ciljInput: string;
  setCiljInput: (v: string) => void;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onDeleteAccount: () => void;
};

export default function EditProfileModal({
  open,
  onClose,
  editUsername,
  setEditUsername,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  ciljInput,
  setCiljInput,
  imagePreview,
  onImageChange,
  onSave,
  onDeleteAccount,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Uredi profil</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Preview"
                width={100}
                height={100}
                className="rounded-full border-4 border-teal-300/40"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-3xl text-white font-bold">
                {editUsername[0]?.toUpperCase() || "?"}
              </div>
            )}

            <label className="absolute bottom-0 right-0 primary-action p-3 rounded-full cursor-pointer">
              <Camera className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            placeholder="Uporabniško ime"
            className="dark-field w-full p-4 rounded-xl"
          />

          <input
            type="password"
            placeholder="Staro geslo"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="dark-field w-full p-4 rounded-xl"
          />

          <input
            type="password"
            placeholder="Novo geslo"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="dark-field w-full p-4 rounded-xl"
          />

          <input
            type="password"
            placeholder="Potrdi novo geslo"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="dark-field w-full p-4 rounded-xl"
          />

          <div className="pt-4 border-t border-white/10">
            <label className="block text-sm font-medium mb-2 text-slate-300">Letni cilj dobička (€)</label>
            <input
              type="number"
              value={ciljInput}
              onChange={(e) => setCiljInput(e.target.value)}
              className="dark-field w-full p-4 rounded-xl text-lg"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/15 text-slate-100 rounded-xl font-semibold">
            Prekliči
          </button>
          <button onClick={onSave} className="primary-action px-10 py-3 rounded-xl font-semibold">
            Shrani
          </button>
        </div>

        <div className="mt-10">
          <button
            onClick={onDeleteAccount}
            className="w-full py-4 bg-red-500/90 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg shadow-red-950/20"
          >
            IZBRIŠI RAČUN
          </button>
        </div>
      </div>
    </div>
  );
}
