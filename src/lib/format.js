export const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const pctOff = (mrp, price) => Math.max(0, Math.round(((mrp - price) / mrp) * 100));
