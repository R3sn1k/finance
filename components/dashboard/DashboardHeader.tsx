"use client";

import Image from "next/image";
import { Edit2, LogOut, Menu } from "lucide-react";

type Props = {
  username: string;
  profileImage: string | null;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  onOpenProfile: () => void;
};

export default function DashboardHeader({
  username,
  profileImage,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenProfile,
}: Props) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Finance - dresi</h1>

        {/* Desktop header */}
        <div className="hidden md:flex items-center gap-4">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profil"
              width={40}
              height={40}
              className="rounded-full border-2 border-gray-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-lg font-bold">
              {username[0]?.toUpperCase() || "?"}
            </div>
          )}
          <span className="text-gray-700 font-medium">{username}</span>

          <button onClick={onOpenProfile} className="text-gray-500 hover:text-gray-900">
            <Edit2 className="w-5 h-5" />
          </button>

          <a href="/api/logout" className="text-gray-600 hover:text-gray-900">
            <LogOut className="w-5 h-5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700"
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex flex-col items-center gap-4">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profil"
                width={64}
                height={64}
                className="rounded-full border-2 border-gray-300"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-white text-2xl font-bold">
                {username[0]?.toUpperCase() || "?"}
              </div>
            )}

            <span className="text-lg font-medium text-gray-800">{username}</span>

            <div className="flex gap-6">
              <button
                onClick={() => {
                  onOpenProfile();
                  setMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <Edit2 className="w-6 h-6" />
              </button>

              <a href="/api/logout" className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
