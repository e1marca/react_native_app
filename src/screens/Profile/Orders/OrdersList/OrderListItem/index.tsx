import React from "react";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { StyleSheet, View } from "react-native";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { CategoryItem } from "src/stores/catalogStore/types";
import { Order } from "src/stores/orderStore/types";
import { useFormatPrice } from "src/hooks/useFormatPrice";

interface OrderListItemProps {
  item: Order;
}

export const OrderListItem: React.FC<OrderListItemProps> = ({ item }) => {
  return (
    <View style={s.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 2 }}>
          <MyIcon styles={{ marginRight: 10 }} source={require("icons/delivery.png")} />
          <View style={{}}>
            <MyAppText
              styles={{ ...s.status, ...{ color: item.status_symbol === "delivered" ? "#129850" : "#F9BE28" } }}>
              {item.status}
            </MyAppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
          <MyAppText style={s.date}>{item.date}</MyAppText>
        </View>
      </View>
      <View style={{ padding: 10 }}>
        {item.items.map((i, index) => (
          <OrderItem key={index.toString()} item={i} />
        ))}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderColor: "#E9E9E9",
          }}>
          <MyAppText style={{ fontSize: 16, fontWeight: "600", fontFamily: FontFamily.BOLD }}>Общая сумма</MyAppText>
          <MyAppText style={{ fontSize: 16, fontWeight: "600", fontFamily: FontFamily.BOLD }}>
            {useFormatPrice(item.total_sum)}
          </MyAppText>
        </View>
      </View>
    </View>
  );
};
interface OrderItemProps {
  item: CategoryItem;
}
const OrderItem: React.FC<OrderItemProps> = ({ item }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    <MyAppText style={{ fontWeight: "400", fontSize: 16, color: "#313131" }}>{item.title}</MyAppText>
    <MyAppText style={{ fontWeight: "400", fontSize: 16, color: "#313131" }}>{useFormatPrice(item.price)}</MyAppText>
  </View>
);

const s = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: FontFamily.MEDIUM,
  },
  date: {
    fontWeight: "600",
    fontSize: 14,
    color: "#414141",
    marginLeft: 5,
  },
});
