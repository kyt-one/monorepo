interface Props {
  variantId: string;
  userId: string;
  interval: string;
  tier: string;
}

export const getCheckoutUrl = ({ variantId, userId, interval, tier }: Props) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "https://store.kyt.one/buy/144a3a5c-8f37-41cd-9738-ee63d568f3bb"
      : "https://store.kyt.one/buy";

  return `${baseUrl}/?enabled=${variantId}&checkout[custom][user_id]=${userId}&checkout[custom][interval]=${interval}&checkout[custom][tier]=${tier}`;
};
