export async function apiPostJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = "Napaka pri zahtevi.";
    try {
      const data = await res.json();
      msg = data?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  // če endpoint ne vrača json, bo to failalo — pri tebi večina vrača json, tako da ok
  return res.json() as Promise<T>;
}

export async function apiPostForm<T>(url: string, formData: FormData): Promise<T> {
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Napaka pri shranjevanju profila");
  return res.json() as Promise<T>;
}
