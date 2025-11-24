"use client";
import { useRouter } from "next/navigation";

export default function DashboardClient({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Dobrodošel v tvojem dashboardu za finance dresov.</p>

      <p className="text-green-700 font-semibold mb-6">
        Prijavljen kot: {userEmail}
      </p>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
      >
        Odjava
      </button>
    </div>
  );
}
