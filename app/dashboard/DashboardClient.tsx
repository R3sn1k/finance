// app/dashboard/DashboardClient.tsx – POPOLNA MOBILNO RESPONSIVE VERZIJA
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Menu,
} from "lucide-react";
import type { DashboardProps, Transakcija, MonthlyData, GraphType, FilterType } from "@/types/dashboard";
import { formatMoney, formatIntSl } from "@/lib/format";
import { dayStamp, monthLabelSl } from "@/lib/date";
import { apiPostForm, apiPostJson } from "@/lib/api";
import { GRAPH_META, getDataForYear, chartOptions } from "@/lib/chart";
import { filterSortTransactions } from "@/lib/transactions";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardClient({
  username: initialUsername,
  profileImage: initialProfileImage,
  prihodki = 0,
  odhodki = 0,
  dobiček = 0,
  steviloProdaj = 0,
  transakcije: initialTransakcije = [],
  monthlyData = {},
  letniCiljDobicka = 25000,
}: DashboardProps) {
  const router = useRouter();

  const [openTransakcija, setOpenTransakcija] = useState(false);
  const [openGraph, setOpenGraph] = useState<GraphType | null>(null);
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const [transakcije, setTransakcije] = useState<Transakcija[]>(initialTransakcije);

  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<FilterType>("all");
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
    setFmtCilj(formatIntSl(letniCiljDobicka));
    setFmtPreostanek((letniCiljDobicka - dobiček).toFixed(0).replace(".", ","));
    setFmtIzguba(Math.abs(dobiček).toFixed(2).replace(".", ","));
  }, [dobiček, letniCiljDobicka]);

  useEffect(() => {
    setTransakcije(initialTransakcije);
  }, [initialTransakcije]);

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

  const monthLabels = allMonths.map(monthLabelSl);


  const chartData = {
    labels: monthLabels,
    datasets: openGraph
      ? [
          {
            label: GRAPH_META[openGraph].label,
            data: getDataForYear({ type: openGraph, months: allMonths, monthlyData }),
            borderColor: GRAPH_META[openGraph].border,
            backgroundColor: GRAPH_META[openGraph].bg,
            tension: 0.4,
            fill: true,
          },
        ]
      : [],
  };


  async function dodajTransakcijo() {
  if (!znesek || !opis) return;

  try {
    await apiPostJson("/api/dodaj-transakcijo", { tip, znesek: Number(znesek), opis });
    setZnesek("");
    setOpis("");
    setOpenTransakcija(false);
    router.refresh();
  } catch (e: any) {
    alert(e?.message || "Napaka pri dodajanju transakcije");
  }
}

  async function izbrisiTransakcijo(id: string) {
  if (!confirm("Res želiš izbrisati to transakcijo?")) return;

  try {
    await apiPostJson("/api/izbrisi-transakcijo", { transakcijaId: id });
    setTransakcije((prev) => prev.filter((t) => t._id !== id));
    router.refresh();
  } catch (e: any) {
    alert(e?.message || "Napaka pri brisanju transakcije.");
  }
  }

  async function izbrisiProfil() {
    if (!confirm("RES ŽELIŠ ZA VEDNO IZBRISATI CELOTEN RAČUN IN VSE TRANSAKCIJE?\nTo je NEPOVRATNO!")) return;

    const res = await fetch("/api/izbrisiprofila", { method: "POST" });
    if (res.ok) {
      window.location.href = "/login";
    } else {
      alert("Napaka pri brisanju profila.");
    }
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

    try {
      const data = await apiPostForm<{ username?: string; profileImage?: string | null }>(
        "/api/urejanjeprofila",
        formData
      );

      setUsername(data.username || editUsername);
      setProfileImage(data.profileImage || profileImage);
      setOpenProfileEdit(false);
      router.refresh();
    } catch (e: any) {
      alert(e?.message || "Napaka pri shranjevanju profila");
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

  const filteredTransactions = filterSortTransactions({
    transakcije,
    filterType,
    selectedDate,
    searchTerm,
  });
  
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
      {/* HEADER – MOBILNI MENU */}
      <DashboardHeader
        username={username}
        profileImage={profileImage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenProfile={() => setOpenProfileEdit(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center sm:text-left">Živjo, {username}!</h2>

        {/* LETNI CILJ DOBIČKA */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 className="text-lg sm:text-xl font-bold">Letni cilj dobička {new Date().getFullYear()}</h3>
            <span className="text-xl sm:text-2xl font-black text-gray-800">
              {fmtDobiček} € <span className="text-sm text-gray-500 font-normal">/ {fmtCilj} €</span>
            </span>
          </div>

          <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden mb-4">
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
              <span className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                {dobiček < 0 ? "IZGUBA" : `${odstotekDobicka.toFixed(0)}%`}
              </span>
            </div>
          </div>

          <div className="text-center">
            {dobiček < 0 ? (
              <p className="text-base sm:text-lg font-bold text-red-600">V izgubi za {fmtIzguba} €</p>
            ) : odstotekDobicka >= 100 ? (
              <p className="text-lg sm:text-xl font-bold text-green-600">ČESTITKE! CILJ PRESEŽEN!</p>
            ) : (
              <p className="text-base sm:text-lg text-gray-700">Še <span className="font-bold">{fmtPreostanek} €</span> do cilja</p>
            )}
          </div>
        </div>

        {/* 4 KARTICE – mobilno v 2 stolpca, desktop 4 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <button onClick={() => setOpenGraph("dobiček")} className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition text-left">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Dobiček</p>
            <p className={`text-2xl sm:text-3xl font-bold ${dobiček >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatMoney(dobiček)} €
            </p>
          </button>
          <button onClick={() => setOpenGraph("prihodki")} className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition text-left">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Prihodki</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{formatMoney(prihodki)} €</p>
          </button>
          <button onClick={() => setOpenGraph("odhodki")} className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition text-left">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Odhodki</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-500">{formatMoney(odhodki)} €</p>
          </button>
          <button onClick={() => setOpenGraph("prodaje")} className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition text-left">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Število prodaj</p>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{steviloProdaj}</p>
          </button>
        </div>

        {/* TABELA TRANSAKCIJ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Zgodovina transakcij</h3>
            <button onClick={() => setOpenTransakcija(true)} className="flex items-center gap-2 px-5 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg shadow transition text-sm sm:text-base">
              <Plus className="w-5 h-5" /> Dodaj
            </button>
          </div>

          {/* FILTRI – mobilno v stolpcih */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 text-sm">
                <option value="all">Vsi tipi</option>
                <option value="prihodek">Prihodki</option>
                <option value="odhodek">Odhodki</option>
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 text-sm" placeholder="Išči..." />
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="text-center text-gray-500 py-12 text-base">
              {selectedDate ? `Ni transakcij za ${new Date(selectedDate).toLocaleDateString("sl-SI")}` : "Še ni transakcij"}
            </p>
          ) : (
            <>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left text-sm">
                  <thead className="border-b-2 border-gray-200">
                    <tr>
                      <th className="pb-3 font-semibold text-gray-600">Datum</th>
                      <th className="pb-3 font-semibold text-gray-600">Tip</th>
                      <th className="pb-3 font-semibold text-gray-600">Opis</th>
                      <th className="pb-3 font-semibold text-gray-600 text-right">Znesek</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedTransactions.map((t) => (
                      <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 text-gray-700 text-sm">{new Date(t.datum).toLocaleDateString("sl-SI")}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.tip === "prihodek" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {t.tip === "prihodek" ? "Prihodek" : "Odhodek"}
                          </span>
                        </td>
                        <td className="py-3 text-gray-700 text-sm">{t.opis}</td>
                        <td className={`py-3 text-right font-semibold text-sm ${t.tip === "prihodek" ? "text-green-600" : "text-red-600"}`}>
                          {t.tip === "prihodek" ? "+" : "−"} {formatMoney(t.znesek)} €
                        </td>
                        <td className="py-3 text-right">
                          <button onClick={() => izbrisiTransakcijo(t._id)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Nova transakcija</h3>
              <button onClick={() => setOpenTransakcija(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-5">
              <select value={tip} onChange={(e) => setTip(e.target.value as any)} className="w-full p-4 rounded-lg border border-gray-300">
                <option value="prihodek">Prihodek</option>
                <option value="odhodek">Odhodek</option>
              </select>
              <input type="number" step="0.01" placeholder="Znesek (€)" value={znesek} onChange={(e) => setZnesek(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300" />
              <input type="text" placeholder="Opis" value={opis} onChange={(e) => setOpis(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300" />
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={() => setOpenTransakcija(false)} className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">
                Prekliči
              </button>
              <button onClick={dodajTransakcijo} className="px-10 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-semibold">
                Shrani
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: GRAF */}
      {openGraph && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-5xl w-full relative">
            <button onClick={() => setOpenGraph(null)} className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100">
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex flex-col gap-4 mb-6">
              <h3 className="text-2xl sm:text-3xl font-black text-center">
                {openGraph === "dobiček" ? "Dobiček" : openGraph === "prihodki" ? "Prihodki" : openGraph === "odhodki" ? "Odhodki" : "Število prodaj"} po mesecih
              </h3>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="mx-auto px-5 py-3 border border-gray-300 rounded-lg text-base font-medium bg-white shadow-sm">
                {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="h-64 sm:h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* POPUP: UREDI PROFIL */}
      {openProfileEdit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Uredi profil</h3>
              <button onClick={() => setOpenProfileEdit(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" width={100} height={100} className="rounded-full border-4 border-gray-300" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-white font-bold">
                    {editUsername[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-gray-900 text-white p-3 rounded-full cursor-pointer hover:bg-black">
                  <Camera className="w-5 h-5" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="Uporabniško ime" className="w-full p-4 rounded-lg border border-gray-300" />
              <input type="password" placeholder="Staro geslo" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300" />
              <input type="password" placeholder="Novo geslo" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300" />
              <input type="password" placeholder="Potrdi novo geslo" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300" />
              <div className="pt-4 border-t border-gray-300">
                <label className="block text-sm font-medium mb-2">Letni cilj dobička (€)</label>
                <input type="number" value={ciljInput} onChange={(e) => setCiljInput(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300 text-lg" />
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button onClick={() => setOpenProfileEdit(false)} className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">
                Prekliči
              </button>
              <button onClick={shraniProfil} className="px-10 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-semibold">
                Shrani
              </button>
            </div>

            <div className="mt-10">
              <button onClick={izbrisiProfil} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-lg">
                IZBRIŠI RAČUN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
