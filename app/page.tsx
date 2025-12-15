// app/page.tsx (domača stran – brez scrollanja)
import Link from "next/link";
import { TrendingUp, Wallet, Target, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="h-screen overflow-hidden bg-gray-100 text-gray-900 flex items-center justify-center px-6">

      <div className="max-w-6xl w-full text-center space-y-14">

        {/* NASLOV */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-800">
            Finance – dresi
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Popoln nadzor nad prodajo nogometnih dresov.
            <br />
            Prihodki, odhodki, dobiček in cilji – vse na enem mestu.
          </p>
        </div>

        {/* PREDSTAVITVENI OKVIRČKI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl shadow-sm p-6 text-left space-y-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-900 text-white">
              <Wallet size={22} />
            </div>
            <h3 className="text-lg font-bold">Nadzor financ</h3>
            <p className="text-gray-600 text-sm">
              Pregled vseh prihodkov in odhodkov.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 text-left space-y-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-900 text-white">
              <TrendingUp size={22} />
            </div>
            <h3 className="text-lg font-bold">Dobiček</h3>
            <p className="text-gray-600 text-sm">
              Jasno vidiš zaslužek in izgubo.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 text-left space-y-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-900 text-white">
              <BarChart3 size={22} />
            </div>
            <h3 className="text-lg font-bold">Statistika</h3>
            <p className="text-gray-600 text-sm">
              Grafični prikaz poslovanja.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 text-left space-y-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-900 text-white">
              <Target size={22} />
            </div>
            <h3 className="text-lg font-bold">Letni cilj</h3>
            <p className="text-gray-600 text-sm">
              Spremljanje napredka ciljev.
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-3 px-10 py-3 bg-gray-900 hover:bg-black text-white font-bold text-lg rounded-xl shadow-md transition"
          >
            Prijava
            <span className="text-xl">→</span>
          </Link>

          <p className="text-sm text-gray-500">
            Enostavno. Hitro. Pregledno.
          </p>
        </div>

      </div>
    </div>
  );
}
