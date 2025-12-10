// app/dashboard/DashboardClient.tsx
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
import {
  LogOut,
  Plus,
  X,
  Edit2,
  Camera,
  Filter,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Search,
  Trash2,
} from "lucide-react";

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
  letniCiljDobicka: number;
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
  letniCiljDobicka = 25000,
}: Props) {
  const [openTransakcija, setOpenTransakcija] = useState(false);
  const [openGraph, setOpenGraph] = useState<"dobiček" | "prihodki" | "odhodki" | "prodaje" | null>(null);
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const [tip, setTip] = useState<"prihodek" | "odhodek">("prihodek");
  const [znesek, setZnesek] = useState("");
  const [opis, setOpis] = useState("");

  const [username, setUsername] = useState(initialUsername);
  const [profileImage, setProfileImage] = useState<string | null>(initialProfileImage);

  const [editUsername, setEditUsername] = useState(initialUsername);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialProfileImage);
  const [ciljInput, setCiljInput] = useState(letniCiljDobicka.toString());

  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<"all" | "prihodek" | "odhodek">("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const transactionsPerPage = 10;

  const odstotekDobicka = dobiček > 0 ? Math.min((dobiček / letniCiljDobicka) * 100, 100) : 0;

  const [fmtDobiček, setFmtDobiček] = useState("");
  const [fmtCilj, setFmtCilj] = useState("");
  const [fmtPreostanek, setFmtPreostanek] = useState("");
  const [fmtIzguba, setFmtIzguba] = useState("");

  useEffect(() => {
    setFmtDobiček(dobiček.toFixed(2).replace(".", ","));
    setFmtCilj(letniCiljDobicka.toLocaleString("sl-SI"));
    setFmtPreostanek((letniCiljDobicka - dobiček).toFixed(0).replace(".", ","));
    setFmtIzguba(Math.abs(dobiček).toFixed(2).replace(".", ","));
  }, [dobiček, letniCiljDobicka]);

  const formatMoney = (num: number) => num.toFixed(2).replace(".", ",");

  const availableYears = Array.from(
    new Set(Object.keys(monthlyData).map((key) => parseInt(key.split("-")[0], 10)))
  ).sort((a, b) => b - a);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

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
        case "dobiček": return d.prihodki - d.odhodki;
        case "prihodki": return d.prihodki;
        case "odhodki": return d.odhodki;
        case "prodaje": return d.prodaje;
        default: return 0;
      }
    });
  };

  const chartData = {
    labels: monthLabels,
    datasets: [{
      label: openGraph === "dobiček" ? "Dobiček" : openGraph === "prihodki" ? "Prihodki" : openGraph === "odhodki" ? "Odhodki" : "Prodaje",
      data: openGraph ? getDataForYear(openGraph) : [],
      borderColor: openGraph === "dobiček" || openGraph === "prihodki" ? "#10B981" : openGraph === "odhodki" ? "#F97316" : "#6366F1",
      backgroundColor: openGraph === "dobiček" || openGraph === "prihodki" ? "rgba(16,185,129,0.1)" : openGraph === "odhodki" ? "rgba(249,115,22,0.1)" : "rgba(99,102,241,0.1)",
      tension: 0.4,
      fill: true,
    }],
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

  // --- Funkcije ---
  async function dodajTransakcijo() {
    if (!znesek || !opis) return;
    await fetch("/api/dodaj-transakcijo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tip, znesek: Number(znesek), opis }),
    });
    setZnesek(""); setOpis(""); setOpenTransakcija(false);
    window.location.reload();
  }

  async function izbrisiTransakcijo(id: string) {
    if (!confirm("Res želiš izbrisati to transakcijo?")) return;
    const res = await fetch("/api/izbrisi-transakcijo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transakcijaId: id }),
    });
    if (res.ok) window.location.reload();
    else alert("Napaka pri brisanju transakcije.");
  }

  async function izbrisiProfil() {
    if (!confirm("RES ŽELIŠ ZA VEDNO IZBRISATI CELOTEN RAČUN IN VSE TRANSAKCIJE?\nTo je NEPOVRATNO!")) return;
    if (!confirm("ZADNJA PRILOŽNOST – res želiš izbrisati račun?")) return;
    const res = await fetch("/api/izbrisi-profil", { method: "POST" });
    if (res.ok) window.location.href = "/login";
    else alert("Napaka pri brisanju profila.");
  }

  async function shraniProfil() {
    const formData = new FormData();
    if (editUsername !== username) formData.append("username", editUsername);
    if (newPassword && newPassword === confirmPassword) {
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
    }
    if (imageFile) formData.append("image", imageFile);
    if (Number(ciljInput) !== letniCiljDobicka) formData.append("letniCiljDobicka", ciljInput);

    const res = await fetch("/api/urejanjeprofila", { method: "POST", body: formData });
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Filtriranje
  const filteredTransactions = transakcije
    .filter((t) => {
      const transactionDate = new Date(t.datum);
      const transactionDay = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());

      const matchesType = filterType === "all" || t.tip === filterType;
      const matchesSearch = !searchTerm || t.opis.toLowerCase().includes(searchTerm.toLowerCase());

      if (selectedDate) {
        const selected = new Date(selectedDate);
        const selectedDay = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
        return matchesType && matchesSearch && transactionDay.getTime() === selectedDay.getTime();
      }
      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, selectedDate, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Finance Dresovi</h1>
          <div className="flex items-center gap-5">
            {profileImage ? (
              <Image src={profileImage} alt="Profil" width={48} height={48} className="rounded-full border-2 border-gray-300" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl font-bold">
                {username[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">{username}</span>
              <button
                onClick={() => {
                  setEditUsername(username);
                  setOldPassword(""); setNewPassword(""); setConfirmPassword("");
                  setImageFile(null); setImagePreview(profileImage);
                  setCiljInput(letniCiljDobicka.toString());
                  setOpenProfileEdit(true);
                }}
                className="text-gray-500 hover:text-gray-900"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <a href="/api/logout" className="text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <h2 className="text-3xl font-bold mb-12">Živjo, {username}!</h2>

        {/* LETNI CILJ DOBIČKA */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Letni cilj dobička {new Date().getFullYear()}</h3>
            <span className="text-2xl font-black text-gray-800">
              {fmtDobiček} € <span className="text-sm text-gray-500 font-normal">/ {fmtCilj} €</span>
            </span>
          </div>

          <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute inset-0 h-full transition-all duration-1000 ease-out ${
                dobiček < 0 ? "bg-gradient-to-r from-red-500 to-rose-600" :
                odstotekDobicka >= 100 ? "bg-gradient-to-r from-emerald-500 to-green-600" :
                "bg-gradient-to-r from-indigo-500 to-purple-600"
              }`}
              style={{ width: `${dobiček < 0 ? 100 : Math.min(odstotekDobicka, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black text-white drop-shadow-md">
                {dobiček < 0 ? "IZGUBA" : `${odstotekDobicka.toFixed(0)}%`}
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            {dobiček < 0 ? (
              <p className="text-lg font-bold text-red-600">V izgubi za {fmtIzguba} €</p>
            ) : odstotekDobicka >= 100 ? (
              <p className="text-xl font-bold text-green-600">ČESTITKE! CILJ PRESEŽEN!</p>
            ) : (
              <p className="text-lg text-gray-700">Še <span className="font-bold">{fmtPreostanek} €</span> do cilja</p>
            )}
          </div>
        </div>

        {/* 4 KARTICE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <button onClick={() => setOpenGraph("dobiček")} className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition text-left">
            <p className="text-sm text-gray-500 mb-2">Dobiček</p>
            <p className={`text-4xl font-bold ${dobiček >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatMoney(dobiček)} €
            </p>
          </button>
          <button onClick={() => setOpenGraph("prihodki")} className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition text-left">
            <p className="text-sm text-gray-500 mb-2">Prihodki</p>
            <p className="text-4xl font-bold text-green-600">{formatMoney(prihodki)} €</p>
          </button>
          <button onClick={() => setOpenGraph("odhodki")} className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition text-left">
            <p className="text-sm text-gray-500 mb-2">Odhodki</p>
            <p className="text-4xl font-bold text-orange-500">{formatMoney(odhodki)} €</p>
          </button>
          <button onClick={() => setOpenGraph("prodaje")} className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition text-left">
            <p className="text-sm text-gray-500 mb-2">Število prodaj</p>
            <p className="text-4xl font-bold text-indigo-600">{steviloProdaj}</p>
          </button>
        </div>

        {/* TABELA TRANSAKCIJ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Zgodovina transakcij</h3>
            <button onClick={() => setOpenTransakcija(true)} className="flex items-center gap-3 px-6 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg shadow transition">
              <Plus className="w-5 h-5" /> Dodaj transakcijo
            </button>
          </div>

          {/* FILTRI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Filter className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="w-full pl-11 pr-3 py-3 rounded-lg border border-gray-300 text-sm">
                <option value="all">Vsi tipi</option>
                <option value="prihodek">Prihodki</option>
                <option value="odhodek">Odhodki</option>
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full pl-11 pr-3 py-3 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-3 py-3 rounded-lg border border-gray-300 text-sm" placeholder="Išči po opisu..." />
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="text-center text-gray-500 py-16 text-lg">
              {selectedDate ? `Ni transakcij za ${new Date(selectedDate).toLocaleDateString("sl-SI")}` : "Še ni transakcij"}
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b-2 border-gray-200">
                    <tr>
                      <th className="pb-4 text-sm font-semibold text-gray-600">Datum</th>
                      <th className="pb-4 text-sm font-semibold text-gray-600">Tip</th>
                      <th className="pb-4 text-sm font-semibold text-gray-600">Opis</th>
                      <th className="pb-4 text-sm font-semibold text-gray-600 text-right">Znesek</th>
                      <th className="pb-4 text-sm font-semibold text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedTransactions.map((t) => (
                      <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-4 text-gray-700">{new Date(t.datum).toLocaleDateString("sl-SI")}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.tip === "prihodek" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {t.tip === "prihodek" ? "Prihodek" : "Odhodek"}
                          </span>
                        </td>
                        <td className="py-4 text-gray-700">{t.opis}</td>
                        <td className={`py-4 text-right font-semibold ${t.tip === "prihodek" ? "text-green-600" : "text-red-600"}`}>
                          {t.tip === "prihodek" ? "+" : "-"} {formatMoney(t.znesek)} €
                        </td>
                        <td className="py-4 text-right">
                          <button onClick={() => izbrisiTransakcijo(t._id)} className="text-red-600 hover:text-red-800 transition">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">Stran {currentPage} od {totalPages}</span>
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* POPUP: DODAJ TRANSAKCIJO */}
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

      {/* POPUP: GRAF */}
      {openGraph && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-5xl w-full relative">
            <button onClick={() => setOpenGraph(null)} className="absolute top-6 right-6 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-gray-100">
              <X className="w-7 h-7 text-gray-700" />
            </button>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pr-16">
              <h3 className="text-4xl font-black">
                {openGraph === "dobiček" ? "Dobiček" : openGraph === "prihodki" ? "Prihodki" : openGraph === "odhodki" ? "Odhodki" : "Število prodaj"} po mesecih
              </h3>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="px-6 py-3 border border-gray-300 rounded-lg text-lg font-medium bg-white shadow-sm">
                {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* POPUP: UREDI PROFIL + BRISANJE RAČUNA */}
      {openProfileEdit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full max-h-screen overflow-y-auto">
            <h3 className="text-3xl font-bold mb-8 text-center">Uredi profil</h3>

            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" width={120} height={120} className="rounded-full border-4 border-gray-300" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-4xl text-white font-bold">
                    {editUsername[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-gray-900 text-white p-3 rounded-full cursor-pointer hover:bg-black">
                  <Camera className="w-6 h-6" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-5">
              <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="Uporabniško ime" className="w-full p-4 rounded-lg border border-gray-300" />
              <input type="password" placeholder="Staro geslo" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300" />
              <input type="password" placeholder="Novo geslo" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300" />
              <input type="password" placeholder="Potrdi novo geslo" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300" />
              <div className="pt-6 border-t border-gray-300">
                <label className="block text-sm font-medium mb-2">Letni cilj dobička (€)</label>
                <input type="number" value={ciljInput} onChange={(e) => setCiljInput(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300 text-lg" />
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-10">
              <button onClick={() => setOpenProfileEdit(false)} className="px-10 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">
                Prekliči
              </button>
              <button onClick={shraniProfil} className="px-12 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-semibold">
                Shrani spremembe
              </button>
            </div>

            {/* NEVARNO OBMOČJE */}
            <div className="mt-12 pt-8 border-t-2 border-red-300">
              <p className="text-center text-red-600 font-bold mb-4">Nevarno območje</p>
              <p className="text-center text-sm text-gray-600 mb-6">
                Brisanje računa je <strong>nepovratno</strong>. Izgubiš vse podatke.
              </p>
              <button onClick={izbrisiProfil} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-lg">
                IZBRIŠI MOJ RAČUN ZA VEDNO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}