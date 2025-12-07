// app/dashboard/DashboardClient.tsx → KONČNA VERZIJA Z POPUP UREJANJEM PROFILA (ime + geslo + slika)

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { LogOut, Plus, X, Edit2, Camera } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Transakcija = {
  _id: string;
  datum: string;
  tip: "prihodek" | "odhodek";
  znesek: number;
  opis: string;
};

type MonthlyData = Record<string, { prihodki: number; odhodki: number; prodaje: number }>;

type Props = {
  userEmail: string;
  username: string;
  profileImage: string | null;
  prihodki: number;
  odhodki: number;
  dobiček: number;
  steviloProdaj: number;
  transakcije: Transakcija[];
  monthlyData: MonthlyData;
};

export default function DashboardClient({
  userEmail,
  username: initialUsername,
  profileImage: initialProfileImage,
  prihodki = 0,
  odhodki = 0,
  dobiček = 0,
  steviloProdaj = 0,
  transakcije = [],
  monthlyData = {},
}: Props) {
  const [openTransakcija, setOpenTransakcija] = useState(false);
  const [openGraph, setOpenGraph] = useState<"dobiček" | "prihodki" | "odhodki" | "prodaje" | null>(null);
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Transakcija
  const [tip, setTip] = useState<"prihodek" | "odhodek">("prihodek");
  const [znesek, setZnesek] = useState("");
  const [opis, setOpis] = useState("");

  // Profil
  const [username, setUsername] = useState(initialUsername);
  const [profileImage, setProfileImage] = useState<string | null>(initialProfileImage);

  // Edit profil forma
  const [editUsername, setEditUsername] = useState(initialUsername);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialProfileImage);

  // Leta za graf
  const availableYears = Array.from(
    new Set(Object.keys(monthlyData).map((key) => parseInt(key.split("-")[0], 10)))
  ).sort((a, b) => b - a);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Fiksni meseci jan–dec za izbrano leto
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0");
    return `${selectedYear}-${month}`;
  });

  const monthLabels = allMonths.map((m) =>
    new Date(m + "-01").toLocaleDateString("sl-SI", { month: "short" })
  );

  const getDataForYear = (type: "dobiček" | "prihodki" | "odhodki" | "prodaje") => {
    return allMonths.map((key) => {
      const d = monthlyData[key] || { prihodki: 0, odhodki: 0, prodaje: 0 };
      switch (type) {
        case "dobiček":
          return d.prihodki - d.odhodki;
        case "prihodki":
          return d.prihodki;
        case "odhodki":
          return d.odhodki;
        case "prodaje":
          return d.prodaje;
      }
    });
  };

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: openGraph ? openGraph.charAt(0).toUpperCase() + openGraph.slice(1) : "",
        data: openGraph ? getDataForYear(openGraph) : [],
        borderColor:
          openGraph === "dobiček" || openGraph === "prihodki"
            ? "#10B981"
            : openGraph === "odhodki"
            ? "#F97316"
            : "#6366F1",
        backgroundColor:
          openGraph === "dobiček" || openGraph === "prihodki"
            ? "rgba(16,185,129,0.1)"
            : openGraph === "odhodki"
            ? "rgba(249,115,22,0.1)"
            : "rgba(99,102,241,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

  // Dodaj transakcijo
  async function dodajTransakcijo() {
    if (!znesek || !opis) return;
    await fetch("/api/dodaj-transakcijo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tip, znesek: Number(znesek), opis }),
    });
    setZnesek("");
    setOpis("");
    setOpenTransakcija(false);
    window.location.reload();
  }

  // Shrani profil (ime + geslo + slika)
  async function shraniProfil() {
    const formData = new FormData();

    if (editUsername !== username) formData.append("username", editUsername);
    if (newPassword && newPassword === confirmPassword) {
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
    }
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch("/api/urejanjeprofila", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setUsername(data.username || editUsername);
      setProfileImage(data.profileImage || profileImage);
      setOpenProfileEdit(false);
      window.location.reload();
    } else {
      alert("Napaka pri shranjevanju profila");
    }
  }

  // Predogled slike
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Finance Dresovi</h1>
          <div className="flex items-center gap-5">
            <div className="relative">
              {profileImage ? (
                // cast because we checked profileImage truthy
                <Image src={profileImage as string} alt="Profil" width={48} height={48} className="rounded-full border-2 border-gray-300" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl font-bold">
                  {(username && username.length > 0 ? username.charAt(0) : "").toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">{username}</span>
              <button
                onClick={() => {
                  setEditUsername(username);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setImageFile(null);
                  setImagePreview(profileImage);
                  setOpenProfileEdit(true);
                }}
                className="text-gray-500 hover:text-gray-900"
                aria-label="Uredi profil"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>

            <a href="/api/logout" className="text-gray-600 hover:text-gray-900" aria-label="Odjava">
              <LogOut className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* GLAVNI DEL – identičen kot prej */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <h2 className="text-3xl font-bold mb-12">Živjo, {username}!</h2>

        {/* 4 KARTICE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <button onClick={() => setOpenGraph("dobiček")} className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition text-left">
            <p className="text-sm text-gray-500 mb-2">Dobiček</p>
            <p className={`text-4xl font-bold ${dobiček >= 0 ? "text-green-600" : "text-red-600"}`}>
              {dobiček.toFixed(2).replace(".", ",")} €
            </p>
          </button>

          <button onClick={() => setOpenGraph("prihodki")} className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition text-left">
            <p className="text-sm text-gray-500 mb-2">Prihodki</p>
            <p className="text-4xl font-bold text-green-600">{prihodki.toFixed(2).replace(".", ",")} €</p>
          </button>

          <button onClick={() => setOpenGraph("odhodki")} className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition text-left">
            <p className="text-sm text-gray-500 mb-2">Odhodki</p>
            <p className="text-4xl font-bold text-orange-500">{odhodki.toFixed(2).replace(".", ",")} €</p>
          </button>

          <button onClick={() => setOpenGraph("prodaje")} className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition text-left">
            <p className="text-sm text-gray-500 mb-2">Število prodaj</p>
            <p className="text-4xl font-bold text-indigo-600">{steviloProdaj}</p>
          </button>
        </div>

        {/* TABELA TRANSAKCIJ – enaka kot prej */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Zgodovina transakcij</h3>
            <button onClick={() => setOpenTransakcija(true)} className="flex items-center gap-3 px-6 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg shadow transition">
              <Plus className="w-5 h-5" /> Dodaj transakcijo
            </button>
          </div>
          {/* ... tabela enaka kot prej ... */}
          {transakcije.length === 0 ? (
            <p className="text-center text-gray-500 py-16">Še ni transakcij</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="pb-4 text-sm font-medium text-gray-600">Datum</th>
                    <th className="pb-4 text-sm font-medium text-gray-600">Tip</th>
                    <th className="pb-4 text-sm font-medium text-gray-600">Opis</th>
                    <th className="pb-4 text-sm font-medium text-gray-600 text-right">Znesek</th>
                  </tr>
                </thead>
                <tbody>
                  {transakcije.map((t) => (
                    <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 text-gray-700">{new Date(t.datum).toLocaleDateString("sl-SI")}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.tip === "prihodek" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {t.tip === "prihodek" ? "Prihodek" : "Odhodek"}
                        </span>
                      </td>
                      <td className="py-4 text-gray-700">{t.opis}</td>
                      <td className={`py-4 text-right font-semibold ${t.tip === "prihodek" ? "text-green-600" : "text-red-600"}`}>
                        {t.tip === "prihodek" ? "+" : "−"} {t.znesek.toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* === POPUPJI === */}

      {/* Dodaj transakcijo – enak kot prej */}
      {openTransakcija && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full">
            <h3 className="text-3xl font-bold mb-8 text-center">Nova transakcija</h3>
            <div className="space-y-6">
              <select value={tip} onChange={(e) => setTip(e.target.value as any)} className="w-full p-4 rounded-lg border border-gray-300">
                <option value="prihodek">Prihodek</option>
                <option value="odhodek">Odhodek</option>
              </select>
              <input type="number" step="0.01" placeholder="Znesek (€)" value={znesek} onChange={(e) => setZnesek(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300" />
              <input type="text" placeholder="Opis" value={opis} onChange={(e) => setOpis(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300" />
            </div>
            <div className="flex justify-center gap-6 mt-10">
              <button onClick={() => { setOpenTransakcija(false); setZnesek(""); setOpis(""); }} className="px-10 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">
                Prekliči
              </button>
              <button onClick={dodajTransakcijo} className="px-12 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-semibold">
                Shrani
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRAF Z IZBIRNIKOM LETA */}
      {openGraph && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-5xl w-full relative">
            <button onClick={() => setOpenGraph(null)} className="absolute top-6 right-6 text-gray-600 hover:text-gray-900">
              <X className="w-10 h-10" />
            </button>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-4xl font-black">
                {openGraph === "dobiček" ? "Dobiček" : openGraph === "prihodki" ? "Prihodki" : openGraph === "odhodki" ? "Odhodki" : "Število prodaj"} po mesecih
              </h3>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="px-6 py-3 border border-gray-300 rounded-lg text-lg">
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* POPUP ZA UREJANJE PROFILA – TO SI ŽELEL NAZAJ */}
      {openProfileEdit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full">
            <h3 className="text-3xl font-bold mb-8 text-center">Uredi profil</h3>

            {/* Slika */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                {imagePreview ? (
                  <Image src={imagePreview as string} alt="Preview" width={120} height={120} className="rounded-full border-4 border-gray-300" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-4xl text-white font-bold">
                    {(editUsername && editUsername.length > 0 ? editUsername.charAt(0) : "").toUpperCase()}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-gray-900 text-white p-3 rounded-full cursor-pointer hover:bg-black transition">
                  <Camera className="w-6 h-6" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-5">
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Uporabniško ime"
                className="w-full p-4 rounded-lg border border-gray-300"
              />

              <input
                type="password"
                placeholder="Staro geslo (obvezno za spremembo)"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-4 rounded-lg border border-gray-300"
              />

              <input
                type="password"
                placeholder="Novo geslo (neobvezno)"
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
            </div>

            <div className="flex justify-center gap-6 mt-10">
              <button
                onClick={() => setOpenProfileEdit(false)}
                className="px-10 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
              >
                Prekliči
              </button>
              <button onClick={shraniProfil} className="px-12 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-semibold">
                Shrani spremembe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
