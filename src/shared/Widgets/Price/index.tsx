import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontFamily } from "../MyAppText";
import { observer } from "mobx-react-lite";
import { useFormatPrice } from "src/hooks/useFormatPrice";

export const Price: React.FC<{
  price_old: number | null;
  actual_price: number;
  oldPricefontSize: number;
  actualPriceFontSize: number;
}> = observer(({ actual_price, actualPriceFontSize }) => {
  return (
    <View style={styles.priceContainer}>
      {/* {price_old && price_old > 0 && (
        <Text style={[styles.oldPrice, { fontSize: oldPricefontSize }]}>{useFormatPrice(price_old)}</Text>
      )} */}
      <Text style={[styles.actualPrice, { fontSize: actualPriceFontSize }]}>{useFormatPrice(actual_price)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  priceContainer: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  oldPrice: {
    textDecorationLine: "line-through",
    fontFamily: FontFamily.REGULAR,
    color: "#0E0F0F",
    fontWeight: "400",
    marginRight: 8,
  },
  actualPrice: { fontFamily: FontFamily.SEMIBOLD, color: "#0E0F0F", fontWeight: "600" },
});
