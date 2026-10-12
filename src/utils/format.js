export const money = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format((n || 0) / 100);
export const date = (d) =>
  new Date(d).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
export const cents = (v) => Math.round(Number(v || 0) * 100);
export const today = () => new Date().toISOString().slice(0, 10);
