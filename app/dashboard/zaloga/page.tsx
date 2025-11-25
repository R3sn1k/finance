// app/dashboard/zaloga/page.tsx
import { writeClient } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { Shirt, ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import { prodajDres } from "../actions";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

// Brisanje dresa + vseh njegovih prodaj
async function izbrisiDres(dresId: string) {
  "use server";
  const userEmail = (await cookies()).get("userEmail")?.value ?? "neznan";

  const prodaje = await writeClient.fetch(
    `*[_type == "prodaja" && dres._ref == $dresId && userEmail == $userEmail]._id`,
    { dresId, userEmail }
  );

  const tx = writeClient.transaction();
  prodaje.forEach((id: string) => tx.delete(id));
  tx.delete(dresId);
  await tx.commit();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/zaloga");
}

export default async function ZalogaPage() {
  const userEmail = (await cookies()).get("userEmail")?.value ?? "neznan";

  const dresi = await writeClient.fetch(
    `*[_type == "dres" && userEmail == $userEmail] | order(_createdAt desc) {
      _id,
      ime,
      klub,
      velikost,
      zaloga,
      cenaProdaje,
      slika { asset-> { url } }
    }`,
    { userEmail }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-6">
          <Link href="/dashboard" className="text-white hover:text-white/80 transition">
            <ArrowLeft className="w-8 h-8" />
          </Link>
          <h1 className="text-3xl font-extrabold">Zaloga dresov</h1>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {dresi.map((dres: any) => (
            <div
              key={dres._id}
              className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition flex flex-col"
            >
              {/* Slika */}
              {dres.slika?.asset?.url ? (
                <div className="aspect-square relative">
                  <Image
                    src={dres.slika.asset.url}
                    alt={dres.ime}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-white/20 flex items-center justify-center">
                  <Shirt className="w-28 h-28 text-white/40" />
                </div>
              )}

              {/* CONTENT */}
              <div className="p-6 flex flex-col h-full">

                {/* Ime + klub */}
                <div>
                  <h3 className="text-2xl font-bold truncate">{dres.ime}</h3>
                  <p className="text-white/80 text-sm">{dres.klub} • {dres.velikost}</p>
                </div>

                {/* Cena + zaloga */}
                <div className="mt-4">
                  <p className="text-3xl font-extrabold leading-tight">
                    {dres.cenaProdaje.toFixed(2)}{" "}
                    <span className="text-2xl align-middle">€</span>
                  </p>
                  <p className="text-white/60 mt-1">
                    Zaloga:{" "}
                    <span className={dres.zaloga > 0 ? "text-emerald-300 font-bold" : "text-red-400 font-bold"}>
                      {dres.zaloga}
                    </span>
                  </p>
                </div>

                {/* SPACER — potisne gumbe dol */}
                <div className="flex-grow"></div>

                {/* Gumbi SIDE-BY-SIDE lepo centrirani */}
                {dres.zaloga > 0 ? (
                  <div className="flex items-center justify-between gap-3">

                    {/* Prodano */}
                    <form action={prodajDres.bind(null, dres._id, dres.ime)} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-xl font-bold transition">
                        <ShoppingCart className="w-5 h-5" />
                        Prodano
                      </button>
                    </form>

                    {/* Izbriši */}
                    <form action={izbrisiDres.bind(null, dres._id)} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold transition">
                        <Trash2 className="w-5 h-5" />
                        Izbriši
                      </button>
                    </form>

                  </div>
                ) : (
                  <div className="bg-red-600/80 px-5 py-3 rounded-xl font-bold text-center">
                    Razprodano
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {dresi.length === 0 && (
          <p className="text-center text-4xl text-white/70 mt-20">
            Še nimaš nobenega dresa v zalogi
          </p>
        )}
      </main>
    </div>
  );
}
