import React, { useCallback, useState } from "react";
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Order } from "src/stores/orderStore/types";
import { OrderListItem } from "./OrderListItem";
import { MyAppText } from "src/shared/Widgets/MyAppText";

interface OrderListProps {
  orders: Order[];
}
const TABS = ["Действующие", "Завершенные"];

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const [selectedTab, setTab] = useState(TABS[0]);
  
  const renderItem = ({ item }: { item: Order }) => {
    return <OrderListItem item={item} />;
  };

  const ordersForRender = useCallback(() => {
    if (selectedTab === "Завершенные") {
      return orders.filter(order => order.status_symbol === "delivered");
    }
    return orders.filter(order => order.status_symbol !== "delivered");
  }, [orders, selectedTab]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", backgroundColor: "#FFF", flex: 1 }}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setTab(tab)}
            style={[s.button, selectedTab === tab && s.buttonActive]}>
            <MyAppText style={{ ...s.buttonText, ...(tab === selectedTab && s.buttonActiveText) }}>{tab}</MyAppText>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 10 }}>
        <FlatList
          data={ordersForRender()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  button: { justifyContent: "center", alignItems: "center", width: "50%", padding: 15 },
  buttonActive: { borderBottomWidth: 2, borderBottomColor: "#10BBFF" },
  buttonText: { fontWeight: "400", fontSize: 18, color: "#969595" },
  buttonActiveText: { color: "#10BBFF" },
});
