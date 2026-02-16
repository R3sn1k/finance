"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

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

import type { DashboardProps, Transakcija, GraphType, FilterType } from "@/types/dashboard";

import { formatIntSl } from "@/lib/format";
import { monthLabelSl } from "@/lib/date";
import { apiPostForm, apiPostJson } from "@/lib/api";
import { GRAPH_META, getDataForYear } from "@/lib/chart";
import { filterSortTransactions } from "@/lib/transactions";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import GoalCard from "@/components/dashboard/GoalCard";
import StatCards from "@/components/dashboard/StatCards";
import TransactionsSection from "@/components/dashboard/TransactionsSection";
import AddTransactionModal from "@/components/dashboard/modals/AddTransactionModal";
import GraphModal from "@/components/dashboard/modals/GraphModal";
import EditProfileModal from "@/components/dashboard/modals/EditProfileModal";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TRANSACTIONS_PER_PAGE = 10;

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

  // UI state
  const [openTransakcija, setOpenTransakcija] = useState(false);
  const [openGraph, setOpenGraph] = useState<GraphType | null>(null);
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Year selection
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // New transaction form
  const [tip, setTip] = useState<"prihodek" | "odhodek">("prihodek");
  const [znesek, setZnesek] = useState("");
  const [opis, setOpis] = useState("");

  // Profile
  const [username, setUsername] = useState(initialUsername);
  const [profileImage, setProfileImage] = useState<string | null>(initialProfileImage);

  const [editUsername, setEditUsername] = useState(initialUsername);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialProfileImage);
  const [ciljInput, setCiljInput] = useState(letniCiljDobicka.toString());

  // Transactions list
  const [transakcije, setTransakcije] = useState<Transakcija[]>(initialTransakcije);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTransakcije(initialTransakcije);
  }, [initialTransakcije]);

  // ===== Derived values (no state needed) =====
  const odstotekDobicka = useMemo(() => {
    return dobiček > 0 ? Math.min((dobiček / letniCiljDobicka) * 100, 100) : 0;
  }, [dobiček, letniCiljDobicka]);

  const fmt = useMemo(() => {
    const fmtDob = dobiček.toFixed(2).replace(".", ",");
    const fmtCilj = formatIntSl(letniCiljDobicka);
    const fmtPreostanek = (letniCiljDobicka - dobiček).toFixed(0).replace(".", ",");
    const fmtIzguba = Math.abs(dobiček).toFixed(2).replace(".", ",");
    return { fmtDob, fmtCilj, fmtPreostanek, fmtIzguba };
  }, [dobiček, letniCiljDobicka]);

  const availableYears = useMemo(() => {
    return Array.from(new Set(Object.keys(monthlyData).map((key) => parseInt(key.split("-")[0], 10)))).sort(
      (a, b) => b - a
    );
  }, [monthlyData]);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  const allMonths = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = String(i + 1).padStart(2, "0");
      return `${selectedYear}-${month}`;
    });
  }, [selectedYear]);

  const monthLabels = useMemo(() => allMonths.map(monthLabelSl), [allMonths]);

  const chartData = useMemo(() => {
    return {
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
  }, [monthLabels, openGraph, allMonths, monthlyData]);

  const filteredTransactions = useMemo(() => {
    return filterSortTransactions({
      transakcije,
      filterType,
      selectedDate,
      searchTerm,
    });
  }, [transakcije, filterType, selectedDate, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE);
  }, [filteredTransactions.length]);

  const displayedTransactions = useMemo(() => {
    const start = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
    return filteredTransactions.slice(start, start + TRANSACTIONS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, selectedDate, searchTerm]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===== Actions =====
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

    const res = await fetch("/api/izbrisprofila", { method: "POST" });
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ===== Render =====
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      {/* Top navigation */}
      <DashboardHeader
        username={username}
        profileImage={profileImage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenProfile={() => setOpenProfileEdit(true)}
      />

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center sm:text-left">Živjo, {username}!</h2>

        {/* Goal summary */}
        <GoalCard
          year={new Date().getFullYear()}
          dobiček={dobiček}
          letniCiljDobicka={letniCiljDobicka}
          fmtDob={fmt.fmtDob}
          fmtCilj={fmt.fmtCilj}
          fmtPreostanek={fmt.fmtPreostanek}
          fmtIzguba={fmt.fmtIzguba}
          odstotekDobicka={odstotekDobicka}
        />

        {/* KPI cards */}
        <StatCards
          dobiček={dobiček}
          prihodki={prihodki}
          odhodki={odhodki}
          steviloProdaj={steviloProdaj}
          onOpenGraph={(t) => setOpenGraph(t)}
        />

        {/* Transactions list */}
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

      {/* Add transaction modal */}
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

      {/* Graph modal */}
      <GraphModal
        openGraph={openGraph}
        onClose={() => setOpenGraph(null)}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableYears={availableYears}
        chartData={chartData}
      />

      {/* Edit profile modal */}
      <EditProfileModal
        open={openProfileEdit}
        onClose={() => setOpenProfileEdit(false)}
        editUsername={editUsername}
        setEditUsername={setEditUsername}
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        ciljInput={ciljInput}
        setCiljInput={setCiljInput}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onSave={shraniProfil}
        onDeleteAccount={izbrisiProfil}
      />
    </div>
  );
}
