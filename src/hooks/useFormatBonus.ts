interface UseFormatBonusParams {
  bonuses: number;
  displayPrefix?: boolean;
}
export const useFormatBonus = ({ bonuses, displayPrefix = true }: UseFormatBonusParams): string => {
  const fBonuses = Math.floor(bonuses / 100);
  const symbol = "Б";
  const prefix = displayPrefix ? "+" : "";
  return `${prefix}${fBonuses} ${symbol}`;
};
