import { observer } from "mobx-react-lite";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useFormatPrice } from "src/hooks/useFormatPrice";
import { useRootStore } from "src/hooks/useRootStore";
import { MyAppText } from "src/shared/Widgets/MyAppText";

export const OrderSummary = observer(() => {
  const { cartStore } = useRootStore();
  const { cart } = cartStore;

  return (
    <View style={s.container}>
      <View style={s.totalAmountAndDiscountWrapper}>
        <MyAppText style={s.totalAmountAndDiscountTitle}>Итого: </MyAppText>
        <MyAppText style={s.totalAmountAndDiscountText}>{cart && useFormatPrice(cart.total_sum)}</MyAppText>
      </View>
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    paddingVertical: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  totalAmountAndDiscountWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalAmountAndDiscountTitle: {
    color: "#333333",
    fontWeight: "400",
    fontSize: 16,
  },
  totalAmountAndDiscountText: {
    color: "#333333",
    fontWeight: "600",
    fontSize: 20,
  },
});
