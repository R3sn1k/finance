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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 shadow-2xl shadow-black/20 backdrop-blur-xl">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Finance - dresi</h1>

        {/* Desktop header */}
        <div className="hidden md:flex items-center gap-4">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profil"
              width={40}
              height={40}
              className="rounded-full border-2 border-teal-300/50 shadow-lg shadow-teal-950/40"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-950/40">
              {username[0]?.toUpperCase() || "?"}
            </div>
          )}
          <span className="text-slate-200 font-medium">{username}</span>

          <button onClick={onOpenProfile} className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <Edit2 className="w-5 h-5" />
          </button>

          <a href="/api/logout" className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <LogOut className="w-5 h-5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-slate-200 transition hover:bg-white/10"
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {/* Mobile menu content */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 py-4 px-6 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profil"
                width={64}
                height={64}
                className="rounded-full border-2 border-teal-300/50"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {username[0]?.toUpperCase() || "?"}
              </div>
            )}

            <span className="text-lg font-medium text-slate-100">{username}</span>

            <div className="flex gap-6">
              <button
                onClick={() => {
                  onOpenProfile();
                  setMobileMenuOpen(false);
                }}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <Edit2 className="w-6 h-6" />
              </button>

              <a href="/api/logout" className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white">
                <LogOut className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
