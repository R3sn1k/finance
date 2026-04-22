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
    <div className="app-shell flex items-center justify-center p-6">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 max-w-md w-full">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300 mb-3">Dobrodošel nazaj</p>
          <h1 className="text-4xl font-black tracking-tight text-white mb-3">Finance Dresi</h1>
          <p className="text-lg text-slate-400">Prijava v aplikacijo</p>
        </div>

        {error && (
          <div className="bg-red-400/10 border border-red-300/20 text-red-200 rounded-xl p-4 mb-8 text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="dark-field w-full px-6 py-4 rounded-xl disabled:opacity-70"
          />

          <input
            type="password"
            placeholder="Geslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="dark-field w-full px-6 py-4 rounded-xl disabled:opacity-70"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="primary-action w-full py-5 font-bold text-xl rounded-xl transition disabled:opacity-70"
          >
            {loading ? "Prijavljam..." : "Prijavi se"}
          </button>
        </div>

        <p className="text-center mt-10 text-slate-400">
          Nimaš računa?{" "}
          <a href="/registracija" className="font-bold text-teal-300 hover:text-teal-200">
            Registriraj se
          </a>
        </p>
      </div>
    </div>
  );
}
