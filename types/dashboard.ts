export type Transakcija = {
  _id: string;
  datum: string;
  tip: "prihodek" | "odhodek";
  znesek: number;
  opis: string;
};

export type MonthlyData = Record<
  string,
  { prihodki: number; odhodki: number; prodaje: number }
>;

export type GraphType = "dobiček" | "prihodki" | "odhodki" | "prodaje";
export type FilterType = "all" | "prihodek" | "odhodek";

export type DashboardProps = {
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
