import { useRootStore } from "./useRootStore";

export const useFormatPrice = (price: number): string => {
  const {
    authStore: { mobileToken },
  } = useRootStore();

  const symbol = mobileToken?.company_info?.currency_hash?.symbol_html || "";

  const rubles = Math.floor(price / 100);
  const kopecks = price % 100;

  if (kopecks === 0) {
    return `${rubles} ${symbol}`;
  } else {
    return `${rubles}.${kopecks < 10 ? "0" : ""}${kopecks} ${symbol}`;
  }
};
