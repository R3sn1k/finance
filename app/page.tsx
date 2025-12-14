// app/page.tsx (domača stran)
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-center px-6 py-12">

      <div className="max-w-4xl w-full text-center space-y-16">

        {/* NASLOV – enak kot v headerju dashboarda */}
        <h1 className="text-5xl md:text-6xl font-black text-gray-800">
          Finance - dresi
        </h1>

        {/* PODNASLOV – svetlo siva pisava, kot v dashboardu */}
        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Popoln nadzor nad prodajo nogometnih dresov.<br />
          Spremljaj prihodke, odhodke, dobiček in letni cilj – vse pregledno na enem mestu.
        </p>

        {/* GUMB – popolnoma enak kot gumbi v dashboardu (npr. "Dodaj transakcijo") */}
        <div className="pt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 hover:bg-black text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            Prijava
            <span className="text-2xl">→</span>
          </Link>
        </div>

        {/* DODATNI PODNASLOV – subtilen, kot footer elementi v dashboardu */}
        <p className="text-base text-gray-500">
          Enostavno. Hitro. Pregledno.
        </p>

      </div>
    </div>
  );
}