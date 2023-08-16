import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useRootStore } from "src/hooks/useRootStore";
import { MyAppText } from "src/shared/Widgets/MyAppText";
import { DeliveryType } from "src/stores/orderStore/types";

export const DeliveryButton: React.FC<{ type: DeliveryType; children: string }> = ({ type, children }) => {
  const {
    orderStore: { fieldsToUpdateOrder, setFieldsToUpdateOrder },
  } = useRootStore();

  const handleSelectDeliveryType = async (delivery_type: DeliveryType) => {
    setFieldsToUpdateOrder({ delivery_type });
  };

  return (
    <TouchableOpacity
      onPress={() => handleSelectDeliveryType(type)}
      style={[s.wrapper, fieldsToUpdateOrder.delivery_type === type && s.selected]}>
      <MyAppText style={s.text}>{children}</MyAppText>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  wrapper: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selected: { backgroundColor: "#FFF" },
  text: { fontSize: 14, fontWeight: "400", color: "#333333" },
});
