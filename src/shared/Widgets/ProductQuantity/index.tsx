import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useFetch } from "src/hooks/useFetch";
import { useRootStore } from "src/hooks/useRootStore";
import { ConfirmModal } from "src/shared/Modals/ConfirmModal";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { CartItem } from "src/stores/cartStore/types";

interface ProductQuantityProps {
  item: CartItem;
}

export const ProductQuantity = observer(({ item }: ProductQuantityProps) => {
  const { cartStore } = useRootStore();
  const { addProductToCart, removeProductFromCart } = cartStore;
  const { invokeApi } = useFetch(addProductToCart);
  const { invokeApi: invokeRemoveProductFromCart } = useFetch(removeProductFromCart);
  const [itemForRemove, setItemForRemove] = useState("");

  const handleDecrease = () => {
    if (item.quantity > 1) {
      invokeApi({ item_id: item._id, quantity: item.quantity - 1, topping_ids: item.topping_ids });
    } else {
      setItemForRemove(item._id);
    }
  };
  const handleIncrease = () => {
    invokeApi({ item_id: item._id, quantity: item.quantity + 1, topping_ids: item.topping_ids });
  };

  const handleConfirmRemove = async () => {
    await invokeRemoveProductFromCart(itemForRemove);
    setItemForRemove("");
  };

  const handleCancelRemove = () => {
    setItemForRemove("");
  };

  return (
    <View style={s.container}>
      <ConfirmModal
        visible={!!itemForRemove}
        title="Удалить товар"
        handleConfirm={handleConfirmRemove}
        handleCancel={handleCancelRemove}
      />
      <TouchableOpacity onPress={handleDecrease}>
        <MyAppText style={s.operationStyle}>-</MyAppText>
      </TouchableOpacity>
      <MyAppText style={s.text}>{item.quantity}</MyAppText>
      <TouchableOpacity onPress={handleIncrease}>
        <MyAppText style={s.operationStyle}>+</MyAppText>
      </TouchableOpacity>
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F1F1F0",
    padding: 5,
    alignSelf: "flex-start",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
    marginHorizontal: 8,
    fontFamily: FontFamily.REGULAR,
    color: "#333333",
    opacity: 0.8,
  },
  operationStyle: {
    fontSize: 20,
    fontWeight: "400",
    marginHorizontal: 10,
    fontFamily: FontFamily.REGULAR,
    color: "#333333",
    opacity: 0.8,
  },
});
