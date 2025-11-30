export const shortNumber = (num: number | undefined | null) => {
  if (!num) return "N/A";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};
