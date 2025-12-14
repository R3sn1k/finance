// app/login/page.tsx
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        const data = await res.json();
        setError(data.error || "Napačen email ali geslo.");
      }
    } catch {
      setError("Napaka pri povezavi s strežnikom.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 max-w-md w-full">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight text-gray-800 mb-4">
            Finance Dresi
          </h1>
          <p className="text-xl text-gray-600">Prijava v aplikacijo</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-8 text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-6 py-4 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition disabled:opacity-70"
          />

          <input
            type="password"
            placeholder="Geslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-6 py-4 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition disabled:opacity-70"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-5 bg-gray-900 hover:bg-black text-white font-bold text-xl rounded-lg shadow-lg transition transform hover:scale-105 active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Prijavljam..." : "Prijavi se"}
          </button>
        </div>

        <p className="text-center mt-10 text-gray-600">
          Nimaš računa?{" "}
          <a href="/registracija" className="font-bold text-gray-900 hover:underline">
            Registriraj se
          </a>
        </p>

      </div>
    </div>
  );
}