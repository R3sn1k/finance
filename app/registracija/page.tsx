"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!username.trim()) return setError("Vnesi uporabniško ime!");
    if (password !== confirmPassword) return setError("Gesli se ne ujemata!");
    if (password.length < 6) return setError("Geslo mora imeti vsaj 6 znakov!");

    const res = await fetch("/api/registracija", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      setError(data.error || "Napaka pri registraciji.");
    }
  }

  return (
    <div className="app-shell flex items-center justify-center p-6">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 max-w-md w-full">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300 mb-3">Nov račun</p>
          <h1 className="text-4xl font-black tracking-tight text-white mb-3">Finance Dresi</h1>
          <p className="text-lg text-slate-400">Ustvari nov račun</p>
        </div>

        {success && (
          <div className="bg-emerald-400/10 border border-emerald-300/20 text-emerald-200 rounded-xl p-4 mb-8 text-center font-medium">
            Uspešno registriran! Preusmerjam na prijavo...
          </div>
        )}

        {error && (
          <div className="bg-red-400/10 border border-red-300/20 text-red-200 rounded-xl p-4 mb-8 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Uporabniško ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="dark-field w-full px-6 py-4 rounded-xl"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="dark-field w-full px-6 py-4 rounded-xl"
          />

          <input
            type="password"
            placeholder="Geslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="dark-field w-full px-6 py-4 rounded-xl"
          />

          <input
            type="password"
            placeholder="Ponovi geslo"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="dark-field w-full px-6 py-4 rounded-xl"
          />

          <button type="submit" className="primary-action w-full py-5 font-bold text-xl rounded-xl transition">
            Registriraj se
          </button>
        </form>

        <p className="text-center mt-10 text-slate-400">
          Že imaš račun?{" "}
          <a href="/login" className="font-bold text-teal-300 hover:text-teal-200">
            Prijava
          </a>
        </p>
      </div>
    </div>
  );
}
