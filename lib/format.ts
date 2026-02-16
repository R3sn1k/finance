export function formatMoney(num: number) {
  return num.toFixed(2).replace(".", ",");
}

export function formatIntSl(num: number) {
  return num.toLocaleString("sl-SI");
}
