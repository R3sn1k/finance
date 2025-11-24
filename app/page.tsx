import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6">

      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
          Finance – Prodaja Nogometnih Dresov
        </h1>

        <p className="text-lg text-gray-100 mb-10 leading-relaxed">
          Upravljaj prodajo dresov, spremljaj stroške, prihodke in profit.
          Ta spletna aplikacija ti omogoča popoln nadzor nad financami,
          pregled nad prodajami ter hitro analizo zaslužka.
        </p>

        <Link
          href="/login"
          className="inline-block bg-white text-indigo-700 font-semibold text-lg px-8 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition"
        >
          Nadaljuj → Prijava
        </Link>
      </div>

    </div>
  );
}
