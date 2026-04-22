"use client";

import { ArrowLeft, ArrowRight, Calendar, Filter, Plus, Search, Trash2 } from "lucide-react";
import type { FilterType, Transakcija } from "@/types/dashboard";
import { formatMoney } from "@/lib/format";

type Props = {
  filterType: FilterType;
  setFilterType: (v: FilterType) => void;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filteredCount: number;
  displayedTransactions: Transakcija[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
};

export default function TransactionsSection({
  filterType,
  setFilterType,
  selectedDate,
  setSelectedDate,
  searchTerm,
  setSearchTerm,
  filteredCount,
  displayedTransactions,
  currentPage,
  totalPages,
  onPageChange,
  onAdd,
  onDelete,
}: Props) {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Transakcije</p>
          <h3 className="mt-1 text-xl sm:text-2xl font-black text-white">Zgodovina transakcij</h3>
        </div>

        <button
          onClick={onAdd}
          className="primary-action flex items-center gap-2 px-5 py-3 font-semibold rounded-xl transition text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" /> Dodaj
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Filter className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="dark-field w-full pl-10 pr-3 py-3 rounded-xl text-sm"
          >
            <option value="all">Vsi tipi</option>
            <option value="prihodek">Prihodki</option>
            <option value="odhodek">Odhodki</option>
          </select>
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="dark-field w-full pl-10 pr-3 py-3 rounded-xl text-sm"
          />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark-field w-full pl-10 pr-3 py-3 rounded-xl text-sm"
            placeholder="Išči..."
          />
        </div>
      </div>

      {filteredCount === 0 ? (
        <p className="text-center text-slate-400 py-12 text-base">
          {selectedDate ? `Ni transakcij za ${new Date(selectedDate).toLocaleDateString("sl-SI")}` : "Še ni transakcij"}
        </p>
      ) : (
        <>
          <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="pb-3 font-semibold text-slate-400">Datum</th>
                  <th className="pb-3 font-semibold text-slate-400">Tip</th>
                  <th className="pb-3 font-semibold text-slate-400">Opis</th>
                  <th className="pb-3 font-semibold text-slate-400 text-right">Znesek</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {displayedTransactions.map((t) => (
                  <tr key={t._id} className="border-b border-white/5 transition hover:bg-white/[0.04]">
                    <td className="py-4 text-slate-300 text-sm">{new Date(t.datum).toLocaleDateString("sl-SI")}</td>

                    <td className="py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          t.tip === "prihodek"
                            ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/20"
                            : "bg-red-400/10 text-red-300 ring-1 ring-red-300/20"
                        }`}
                      >
                        {t.tip === "prihodek" ? "Prihodek" : "Odhodek"}
                      </span>
                    </td>

                    <td className="py-4 text-slate-200 text-sm">{t.opis}</td>

                    <td className={`py-4 text-right font-semibold text-sm ${t.tip === "prihodek" ? "text-emerald-300" : "text-red-300"}`}>
                      {t.tip === "prihodek" ? "+" : "-"} {formatMoney(t.znesek)} €
                    </td>

                    <td className="py-4 text-right">
                      <button onClick={() => onDelete(t._id)} className="rounded-lg p-2 text-red-300 transition hover:bg-red-400/10 hover:text-red-200">
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
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <span className="text-sm text-slate-400">
                Stran {currentPage} od {totalPages}
              </span>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-50"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
