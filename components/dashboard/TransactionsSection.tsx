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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Zgodovina transakcij</h3>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg shadow transition text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" /> Dodaj
        </button>
      </div>

      {/* FILTRI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 text-sm"
          >
            <option value="all">Vsi tipi</option>
            <option value="prihodek">Prihodki</option>
            <option value="odhodek">Odhodki</option>
          </select>
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 text-sm"
          />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 text-sm"
            placeholder="Išči..."
          />
        </div>
      </div>

      {filteredCount === 0 ? (
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
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          t.tip === "prihodek" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {t.tip === "prihodek" ? "Prihodek" : "Odhodek"}
                      </span>
                    </td>

                    <td className="py-3 text-gray-700 text-sm">{t.opis}</td>

                    <td className={`py-3 text-right font-semibold text-sm ${t.tip === "prihodek" ? "text-green-600" : "text-red-600"}`}>
                      {t.tip === "prihodek" ? "+" : "−"} {formatMoney(t.znesek)} €
                    </td>

                    <td className="py-3 text-right">
                      <button onClick={() => onDelete(t._id)} className="text-red-600 hover:text-red-800">
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
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <span className="text-sm text-gray-600">
                Stran {currentPage} od {totalPages}
              </span>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
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
