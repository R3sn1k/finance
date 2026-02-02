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
import GoalCard from "@/components/dashboard/GoalCard";
import StatCards from "@/components/dashboard/StatCards";
import TransactionsSection from "@/components/dashboard/TransactionsSection";
import AddTransactionModal from "@/components/dashboard/modals/AddTransactionModal";


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
        <GoalCard
          year={new Date().getFullYear()}
          dobiček={dobiček}
          letniCiljDobicka={letniCiljDobicka}
          fmtDob={fmtDobiček}
          fmtCilj={fmtCilj}
          fmtPreostanek={fmtPreostanek}
          fmtIzguba={fmtIzguba}
          odstotekDobicka={odstotekDobicka}
        />

        {/* 4 KARTICE – mobilno v 2 stolpca, desktop 4 */}
        <StatCards
          dobiček={dobiček}
          prihodki={prihodki}
          odhodki={odhodki}
          steviloProdaj={steviloProdaj}
          onOpenGraph={(t) => setOpenGraph(t)}
        />

        {/* TABELA TRANSAKCIJ */}
        <TransactionsSection
          filterType={filterType}
          setFilterType={setFilterType}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredCount={filteredTransactions.length}
          displayedTransactions={displayedTransactions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onAdd={() => setOpenTransakcija(true)}
          onDelete={izbrisiTransakcijo}
        />
      </main>

      {/* POPUP: DODAJ TRANSAKCIJO */}
      <AddTransactionModal
        open={openTransakcija}
        onClose={() => setOpenTransakcija(false)}
        tip={tip}
        setTip={setTip}
        znesek={znesek}
        setZnesek={setZnesek}
        opis={opis}
        setOpis={setOpis}
        onSave={dodajTransakcijo}
      />

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
