// app/register/page.tsx → KONČNO, GUMB DELUJE 100 %!
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 max-w-md w-full">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight text-gray-800 mb-4">
            Finance Dresi
          </h1>
          <p className="text-xl text-gray-600">Ustvari nov račun</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-8 text-center font-medium">
            Uspešno registriran! Preusmerjam na prijavo...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-8 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="text"
            placeholder="Uporabniško ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-6 py-4 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-6 py-4 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          />

          <input
            type="password"
            placeholder="Geslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-6 py-4 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          />

          <input
            type="password"
            placeholder="Ponovi geslo"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-6 py-4 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          />

          {/* GUMB – type="submit" JE KLJUČ! */}
          <button
            type="submit"
            className="w-full py-5 bg-gray-900 hover:bg-black text-white font-bold text-xl rounded-lg shadow-lg transition transform hover:scale-105"
          >
            Registriraj se
          </button>
        </form>

        <p className="text-center mt-10 text-gray-600">
          Že imaš račun?{" "}
          <a href="/login" className="font-bold text-gray-900 hover:underline">
            Prijava
          </a>
        </p>

      </div>
    </div>
  );
}