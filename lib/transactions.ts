import type { FilterType, Transakcija } from "@/types/dashboard";
import { dayStamp } from "@/lib/date";

export function filterSortTransactions(params: {
  transakcije: Transakcija[];
  filterType: FilterType;
  selectedDate: string; // "YYYY-MM-DD" ali ""
  searchTerm: string;
}) {
  const { transakcije, filterType, selectedDate, searchTerm } = params;

  const term = searchTerm.trim().toLowerCase();
  const selectedStamp = selectedDate ? dayStamp(new Date(selectedDate)) : null;

  return transakcije
    .filter((t) => {
      const matchesType = filterType === "all" || t.tip === filterType;
      const matchesSearch = !term || t.opis.toLowerCase().includes(term);
      if (!matchesType || !matchesSearch) return false;

      if (selectedStamp) {
        return dayStamp(new Date(t.datum)) === selectedStamp;
      }
      return true;
    })
    .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());
}
