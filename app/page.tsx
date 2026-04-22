import Link from "next/link";
import { ArrowRight, BarChart3, Target, TrendingUp, Wallet } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Nadzor financ",
    text: "Pregled vseh prihodkov in odhodkov.",
  },
  {
    icon: TrendingUp,
    title: "Dobiček",
    text: "Jasno vidiš zaslužek in izgubo.",
  },
  {
    icon: BarChart3,
    title: "Statistika",
    text: "Grafični prikaz poslovanja.",
  },
  {
    icon: Target,
    title: "Letni cilj",
    text: "Spremljanje napredka ciljev.",
  },
];

export default function HomePage() {
  return (
    <div className="app-shell min-h-screen overflow-hidden px-6 py-10 flex items-center">
      <div className="max-w-6xl w-full mx-auto">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <section className="space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Finance za prodajo dresov</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white">Finance Dresi</h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                Popoln nadzor nad prihodki, odhodki, dobičkom in cilji na enem mirnem, preglednem dashboardu.
              </p>
            </div>

            <Link
              href="/login"
              className="primary-action inline-flex items-center gap-3 px-8 py-4 font-bold text-lg rounded-2xl transition"
            >
              Prijava
              <ArrowRight className="w-5 h-5" />
            </Link>
          </section>

          <section className="glass-panel rounded-3xl p-5 sm:p-6">
            <div className="grid grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
                  <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-teal-300/10 text-teal-300 ring-1 ring-teal-300/20">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
                  <p className="mt-2 text-slate-400 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
