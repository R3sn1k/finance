// app/login/page.tsx
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      setError("Napačen email ali geslo.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6">

      <div className="max-w-md w-full text-center">

        {/* Logotip / Naslov */}
        <h1 className="text-5xl font-extrabold mb-8 drop-shadow-lg">
          Finance – prodaja dresov
        </h1>

        {/* Login kartica */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10">

          <h2 className="text-3xl font-bold mb-8 text-white">
            Prijava v aplikacijo
          </h2>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-4 focus:ring-white/50 mb-4 text-lg"
          />

          {/* Geslo */}
          <input
            type="password"
            placeholder="Geslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-4 focus:ring-white/50 mb-6 text-lg"
          />

          {/* Error */}
          {error && (
            <p className="text-red-300 bg-red-500/20 rounded-lg py-3 px-4 mb-6 text-sm font-medium">
              {error}
            </p>
          )}

          {/* Gumb */}
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-white text-indigo-700 font-bold text-xl rounded-xl shadow-lg hover:bg-gray-100 transition transform hover:scale-[1.02] active:scale-100"
          >
            Prijavi se
          </button>

          {/* Spodaj majhen tekst */}
          <p className="mt-8 text-white/70 text-sm">
            Nimaš računa? <span className="underline">Kontaktiraj administratorja</span>
          </p>

        </div>
      </div>
    </div>
  );
}