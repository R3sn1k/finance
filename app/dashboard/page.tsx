// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { LogOut } from "lucide-react";

export default async function DashboardPage() {
  const userEmail = (await cookies()).get("userEmail")?.value ?? "neznan";

  return (
    <>
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-5 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Finance Dresovi</h1>
          
          <div className="flex items-center gap-5">
            <span className="text-gray-700 font-medium hidden sm:block">
              {userEmail}
            </span>
            <a 
  href="/api/logout" 
  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition"
>
  <LogOut className="w-5 h-5" />
  <span className="hidden sm:inline">Odjava</span>
</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-12">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Živjo, {userEmail.split("@")[0]}! 
          </h2>
          <p className="text-xl text-gray-600">
            Dobrodošel nazaj v tvojem finančnem centru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
            <p className="text-indigo-100 text-lg">Trenutno stanje</p>
            <p className="text-5xl font-bold mt-3">12.457,89 €</p>
            <p className="text-indigo-100 mt-4 text-sm">+320,50 € ta mesec</p>
          </div>

          <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <p className="text-gray-600">Prihodki ta mesec</p>
            <p className="text-4xl font-bold text-green-600 mt-3">4.820,50 €</p>
          </div>

          <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <p className="text-gray-600">Odhodki ta mesec</p>
            <p className="text-4xl font-bold text-red-600 mt-3">2.130,20 €</p>
          </div>
        </div>

        <div className="mt-16 text-center bg-gray-50 rounded-3xl p-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Vse pod nadzorom 
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stran se je naložila takoj, ker Next.js 16 pravilno streama tudi async page komponente.
          </p>
        </div>
      </main>
    </>
  );
}