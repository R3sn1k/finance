"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, ImagePlus, PackageCheck, Plus, Shirt, Trash2, Warehouse, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/format";

export type DresStatus = "v_prihodu" | "na_zalogi" | "prodan";

export type Dres = {
  _id: string;
  _createdAt: string;
  ime: string;
  cenaProdaje: number;
  zaloga?: number;
  status?: DresStatus;
  slikaUrl?: string | null;
};

const statusMeta: Record<DresStatus, { label: string; className: string; icon: typeof Clock3 }> = {
  v_prihodu: { label: "V prihodu", className: "border-blue-300/60 text-blue-100", icon: Clock3 },
  na_zalogi: { label: "Na zalogi", className: "border-emerald-300/60 text-emerald-100", icon: Warehouse },
  prodan: { label: "Prodan", className: "border-slate-300/60 text-slate-100", icon: CheckCircle2 },
};

async function readJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as { error?: string };
  } catch {
    return null;
  }
}

export default function DresiClient({ dresi }: { dresi: Dres[] }) {
  const router = useRouter();
  const [ime, setIme] = useState("");
  const [cenaProdaje, setCenaProdaje] = useState("");
  const [kolicina, setKolicina] = useState("1");
  const [status, setStatus] = useState<DresStatus>("na_zalogi");
  const [slika, setSlika] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saleDres, setSaleDres] = useState<Dres | null>(null);
  const [saleKolicina, setSaleKolicina] = useState("1");
  const [saleOpis, setSaleOpis] = useState("");
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const inStockCount = dresi
      .filter((dres) => (dres.status || "na_zalogi") === "na_zalogi")
      .reduce((sum, dres) => sum + Math.max(0, Number(dres.zaloga || 0)), 0);
    const incomingCount = dresi
      .filter((dres) => dres.status === "v_prihodu")
      .reduce((sum, dres) => sum + Math.max(0, Number(dres.zaloga || 0)), 0);

    return { inStockCount, incomingCount };
  }, [dresi]);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError("");

    const parsedKolicina = Math.floor(Number(kolicina));

    if (!ime.trim() || !cenaProdaje) {
      setError("Vnesi ime dresa in prodajno ceno.");
      return;
    }

    if (!Number.isFinite(parsedKolicina) || parsedKolicina < 1) {
      setError("Količina mora biti vsaj 1.");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("ime", ime);
    formData.append("cenaProdaje", cenaProdaje);
    formData.append("kolicina", String(parsedKolicina));
    formData.append("status", status);
    if (slika) formData.append("slika", slika);

    try {
      const res = await fetch("/api/dresi", { method: "POST", body: formData });
      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error(data?.error || "Napaka pri dodajanju dresa.");

      setIme("");
      setCenaProdaje("");
      setKolicina("1");
      setStatus("na_zalogi");
      setSlika(null);
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Napaka pri dodajanju dresa.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(dresId: string, nextStatus: DresStatus) {
    const dres = dresi.find((item) => item._id === dresId);
    if (nextStatus === "prodan" && dres) {
      openSaleModal(dres);
      return;
    }

    setError("");
    setBusyId(dresId);

    try {
      const res = await fetch("/api/dresi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dresId, status: nextStatus }),
      });
      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error(data?.error || "Napaka pri spremembi statusa.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Napaka pri spremembi statusa.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(dresId: string) {
    if (!confirm("Res želiš izbrisati ta dres?")) return;

    setError("");
    setBusyId(dresId);

    try {
      const res = await fetch("/api/dresi", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dresId }),
      });
      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error(data?.error || "Napaka pri brisanju dresa.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Napaka pri brisanju dresa.");
    } finally {
      setBusyId(null);
    }
  }

  function openSaleModal(dres: Dres) {
    setError("");
    setSaleDres(dres);
    setSaleKolicina("1");
    setSaleOpis(`Prodaja dresa - ${dres.ime}`);
  }

  async function handleSell() {
    if (!saleDres) return;

    const parsedKolicina = Math.floor(Number(saleKolicina));
    const zaloga = Math.max(0, Number(saleDres.zaloga || 0));

    if (!Number.isFinite(parsedKolicina) || parsedKolicina < 1) {
      setError("Količina prodaje mora biti vsaj 1.");
      return;
    }

    if (parsedKolicina > zaloga) {
      setError(`Na zalogi je samo ${zaloga} kosov.`);
      return;
    }

    setError("");
    setBusyId(saleDres._id);

    try {
      const res = await fetch("/api/dresi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dresId: saleDres._id,
          status: "prodan",
          kolicina: parsedKolicina,
          opis: saleOpis,
        }),
      });
      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error(data?.error || "Napaka pri prodaji dresa.");
      setSaleDres(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Napaka pri prodaji dresa.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="app-shell min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Nazaj na dashboard
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Zaloga dresov</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">Dresi</h1>
        </div>

        <section className="grid grid-cols-2 gap-4 mb-8 max-w-md">
          <SummaryCard icon={Warehouse} label="Na zalogi" value={stats.inStockCount.toString()} />
          <SummaryCard icon={Clock3} label="V prihodu" value={stats.incomingCount.toString()} />
        </section>

        <section className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
          <form onSubmit={handleAdd} className="glass-panel rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-300/10 text-teal-300 ring-1 ring-teal-300/20">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Dodaj dres</h2>
                <p className="text-sm text-slate-400">Ime, cena, količina, slika in status.</p>
              </div>
            </div>

            {error && !saleDres && <div className="mb-5 rounded-xl border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</div>}

            <div className="space-y-4">
              <input value={ime} onChange={(e) => setIme(e.target.value)} className="dark-field w-full rounded-xl p-4" placeholder="Ime dresa" />

              <input
                value={cenaProdaje}
                onChange={(e) => setCenaProdaje(e.target.value)}
                type="number"
                step="0.01"
                min="0"
                className="dark-field w-full rounded-xl p-4"
                placeholder="Prodajna cena (€)"
              />

              <input
                value={kolicina}
                onChange={(e) => setKolicina(e.target.value)}
                type="number"
                min="1"
                step="1"
                className="dark-field w-full rounded-xl p-4"
                placeholder="Količina"
              />

              <select value={status} onChange={(e) => setStatus(e.target.value as DresStatus)} className="dark-field w-full rounded-xl p-4">
                <option value="v_prihodu">V prihodu</option>
                <option value="na_zalogi">Na zalogi</option>
                <option value="prodan">Prodan</option>
              </select>

              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 bg-slate-950/30 p-4 text-center text-slate-400 transition hover:border-teal-300/50 hover:text-slate-200">
                <ImagePlus className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">{slika ? slika.name : "Dodaj sliko dresa"}</span>
                <input type="file" accept="image/*" onChange={(e) => setSlika(e.target.files?.[0] || null)} className="hidden" />
              </label>

              <button disabled={saving} className="primary-action w-full rounded-xl py-4 font-bold transition disabled:opacity-60">
                {saving ? "Dodajam..." : "Dodaj dres"}
              </button>
            </div>
          </form>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {dresi.length === 0 ? (
              <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 sm:col-span-2 xl:col-span-3">
                Ni aktivnih dresov za upravljanje.
              </div>
            ) : (
              dresi.map((dres) => (
                <DresCard
                  key={dres._id}
                  dres={dres}
                  busy={busyId === dres._id}
                  onStatusChange={handleStatusChange}
                  onSell={openSaleModal}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {saleDres && (
        <SaleModal
          dres={saleDres}
          kolicina={saleKolicina}
          setKolicina={setSaleKolicina}
          opis={saleOpis}
          setOpis={setSaleOpis}
          busy={busyId === saleDres._id}
          error={error}
          onClose={() => {
            setSaleDres(null);
            setError("");
          }}
          onSell={handleSell}
        />
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof Shirt; label: string; value: string }) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <Icon className="h-4 w-4 text-teal-300" />
      <p className="mt-3 text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function DresCard({
  dres,
  busy,
  onStatusChange,
  onSell,
  onDelete,
}: {
  dres: Dres;
  busy: boolean;
  onStatusChange: (id: string, status: DresStatus) => void;
  onSell: (dres: Dres) => void;
  onDelete: (id: string) => void;
}) {
  const normalizedStatus = dres.status || "na_zalogi";
  const meta = statusMeta[normalizedStatus];
  const Icon = meta.icon;

  return (
    <article className="glass-panel overflow-hidden rounded-2xl">
      <div className="relative aspect-[4/3] bg-slate-950/70">
        {dres.slikaUrl ? (
          <Image src={dres.slikaUrl} alt={dres.ime} fill className="object-cover" sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            <Shirt className="h-14 w-14" />
          </div>
        )}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border bg-slate-950/90 px-3 py-1.5 text-xs font-black shadow-lg shadow-black/50 backdrop-blur-md ${meta.className}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-lg font-black text-white">{dres.ime}</h3>
            <p className="mt-2 text-2xl font-black text-emerald-300">{formatMoney(dres.cenaProdaje)} €</p>
            <p className="mt-1 text-sm font-semibold text-slate-400">Količina: {Math.max(0, Number(dres.zaloga || 0))}</p>
          </div>
          <button
            onClick={() => onDelete(dres._id)}
            disabled={busy}
            className="rounded-xl p-2 text-red-300 transition hover:bg-red-400/10 hover:text-red-200 disabled:opacity-50"
            aria-label="Izbriši dres"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <select
          value={normalizedStatus}
          onChange={(e) => onStatusChange(dres._id, e.target.value as DresStatus)}
          disabled={busy}
          className="dark-field mt-5 w-full rounded-xl p-3 text-sm"
        >
          <option value="v_prihodu">V prihodu</option>
          <option value="na_zalogi">Na zalogi</option>
          <option value="prodan">Prodan</option>
        </select>

        <button
          onClick={() => onSell(dres)}
          disabled={busy}
          className="primary-action mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          <PackageCheck className="h-5 w-5" />
          {busy ? "Shranjujem..." : "Označi kot prodan"}
        </button>
      </div>
    </article>
  );
}

function SaleModal({
  dres,
  kolicina,
  setKolicina,
  opis,
  setOpis,
  busy,
  error,
  onClose,
  onSell,
}: {
  dres: Dres;
  kolicina: string;
  setKolicina: (value: string) => void;
  opis: string;
  setOpis: (value: string) => void;
  busy: boolean;
  error: string;
  onClose: () => void;
  onSell: () => void;
}) {
  const zaloga = Math.max(0, Number(dres.zaloga || 0));
  const parsedKolicina = Math.max(0, Number(kolicina || 0));
  const total = Number(dres.cenaProdaje || 0) * parsedKolicina;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Prodaja dresa</p>
            <h3 className="mt-2 text-2xl font-black text-white">{dres.ime}</h3>
            <p className="mt-1 text-sm text-slate-400">Na zalogi: {zaloga}</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mb-5 rounded-xl border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</div>}

        <div className="space-y-4">
          <input
            value={kolicina}
            onChange={(e) => setKolicina(e.target.value)}
            type="number"
            min="1"
            max={zaloga}
            step="1"
            className="dark-field w-full rounded-xl p-4"
            placeholder="Koliko jih je bilo prodanih?"
          />

          <input
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            className="dark-field w-full rounded-xl p-4"
            placeholder="Text za dashboard transakcijo"
          />

          <div className="rounded-xl bg-slate-950/40 p-4 text-sm text-slate-300 ring-1 ring-white/10">
            Skupaj: <span className="font-black text-emerald-300">{formatMoney(total)} €</span>
          </div>

          <button onClick={onSell} disabled={busy} className="primary-action w-full rounded-xl py-4 font-bold transition disabled:opacity-60">
            {busy ? "Shranjujem..." : "Potrdi prodajo"}
          </button>
        </div>
      </div>
    </div>
  );
}
