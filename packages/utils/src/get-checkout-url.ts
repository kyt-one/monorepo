interface Props {
  productId: string;
  variantId: string;
  userId: string;
  interval: string;
  tier: string;
}

export const getCheckoutUrl = ({ productId, variantId, userId, interval, tier }: Props) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? `https://store.kyt.one/buy/${productId}`
      : "https://store.kyt.one/buy";

  return `${baseUrl}/?enabled=${variantId}&checkout[custom][user_id]=${userId}&checkout[custom][interval]=${interval}&checkout[custom][tier]=${tier}`;
};
