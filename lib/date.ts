export function dayStamp(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function monthLabelSl(yyyyMm: string) {
  return new Date(`${yyyyMm}-01`).toLocaleDateString("sl-SI", { month: "short" });
}
