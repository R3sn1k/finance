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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Uredi profil</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
                className="rounded-full border-4 border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-white font-bold">
                {editUsername[0]?.toUpperCase() || "?"}
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-gray-900 text-white p-3 rounded-full cursor-pointer hover:bg-black">
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
            className="w-full p-4 rounded-lg border border-gray-300"
          />

          <input
            type="password"
            placeholder="Staro geslo"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-300"
          />

          <input
            type="password"
            placeholder="Novo geslo"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-300"
          />

          <input
            type="password"
            placeholder="Potrdi novo geslo"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-300"
          />

          <div className="pt-4 border-t border-gray-300">
            <label className="block text-sm font-medium mb-2">Letni cilj dobička (€)</label>
            <input
              type="number"
              value={ciljInput}
              onChange={(e) => setCiljInput(e.target.value)}
              className="w-full p-4 rounded-lg border border-gray-300 text-lg"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button onClick={onClose} className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">
            Prekliči
          </button>
          <button onClick={onSave} className="px-10 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-semibold">
            Shrani
          </button>
        </div>

        <div className="mt-10">
          <button
            onClick={onDeleteAccount}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-lg"
          >
            IZBRIŠI RAČUN
          </button>
        </div>
      </div>
    </div>
  );
}
