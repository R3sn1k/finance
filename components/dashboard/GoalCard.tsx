"use client";

type Props = {
  year: number;
  dobiček: number;
  letniCiljDobicka: number;
  fmtDob: string;
  fmtCilj: string;
  fmtPreostanek: string;
  fmtIzguba: string;
  odstotekDobicka: number;
};

export default function GoalCard({
  year,
  dobiček,
  letniCiljDobicka,
  fmtDob,
  fmtCilj,
  fmtPreostanek,
  fmtIzguba,
  odstotekDobicka,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-lg sm:text-xl font-bold">Letni cilj dobička {year}</h3>
        <span className="text-xl sm:text-2xl font-black text-gray-800">
          {fmtDob} € <span className="text-sm text-gray-500 font-normal">/ {fmtCilj} €</span>
        </span>
      </div>

      <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className={`absolute inset-0 h-full transition-all duration-1000 ease-out ${
            dobiček < 0
              ? "bg-gradient-to-r from-red-500 to-rose-600"
              : odstotekDobicka >= 100
              ? "bg-gradient-to-r from-emerald-500 to-green-600"
              : "bg-gradient-to-r from-indigo-500 to-purple-600"
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
          <p className="text-base sm:text-lg text-gray-700">
            Še <span className="font-bold">{fmtPreostanek} €</span> do cilja
          </p>
        )}
      </div>
    </div>
  );
}
