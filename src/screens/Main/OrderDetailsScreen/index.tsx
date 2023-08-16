import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { formatAddress, getImageSource } from "src/helpers/functions";
import { useFetch } from "src/hooks/useFetch";
import { useFormatPrice } from "src/hooks/useFormatPrice";
import { useRootStore } from "src/hooks/useRootStore";
import { ConfirmModal } from "src/shared/Modals/ConfirmModal";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { DeliveryType, OrderStatus } from "src/stores/orderStore/types";
import { MainScreenStackParamList, MainScreens } from "../types";

export const OrderDetailsScreen = observer(() => {
  const {
    orderStore: { cancelOrder },
    authStore: { currentOrder },
  } = useRootStore();
  const { invokeApi: invokeCancelOrder } = useFetch(cancelOrder);
  const { navigate } = useNavigation<StackNavigationProp<MainScreenStackParamList>>();
  const [idForCancelOrder, setIdForCancelOrder] = useState("");

  const handleCancelOrder = async () => {
    await invokeCancelOrder(idForCancelOrder);
    setIdForCancelOrder("");
    navigate(MainScreens.HOME_SCREEN);
  };

  const isDelivery = currentOrder?.delivery_type === DeliveryType.delivery;
  const imageSource = isDelivery
    ? require("icons/cartScreen/only_delivery.png")
    : require("icons/cartScreen/only_pickup.png");

  const addressInfo = isDelivery ? formatAddress(currentOrder?.address) : currentOrder?.delivery_pickup_point;

  return (
    <ScrollView>
      <ConfirmModal
        title="Подтвердите отмену заказа"
        visible={!!idForCancelOrder}
        handleCancel={() => setIdForCancelOrder("")}
        handleConfirm={() => handleCancelOrder()}
      />
      <View style={s.container}>
        <View style={s.titleWrapper}>
          <MyAppText style={s.orderText}>Заказ:</MyAppText>
          <MyAppText style={s.orderDateText}>{currentOrder?.date}</MyAppText>
        </View>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          <MyIcon source={imageSource} />
          <MyAppText style={{ fontSize: 16, fontWeight: "500", color: "#505050", marginLeft: 5 }}>
            {addressInfo}
          </MyAppText>
        </View>
        <View style={s.orderStatusWrapper}>
          <View style={s.orderStatusTextWrapper}>
            <MyAppText style={s.orderStatusText}>{currentOrder?.status}</MyAppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", height: 50, justifyContent: "center" }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {currentOrder?.status_symbol === OrderStatus.delivered ||
            currentOrder?.status_symbol === OrderStatus.waiting_delivery ? (
              <CheckedIcon />
            ) : (
              <RefreshIcon />
            )}
          </View>
          <View
            style={{
              height: 2,
              backgroundColor:
                currentOrder?.status_symbol === OrderStatus.delivered ||
                currentOrder?.status_symbol === OrderStatus.waiting_delivery
                  ? "#2FD475"
                  : "#D9D8D8",
              flex: 3,
            }}></View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {currentOrder?.status_symbol === OrderStatus.delivered ||
            currentOrder?.status_symbol === OrderStatus.waiting_delivery ? (
              <CheckedIcon />
            ) : (
              <DotIcon />
            )}
          </View>
          <View
            style={{
              height: 2,
              backgroundColor: currentOrder?.status_symbol === OrderStatus.delivered ? "#2FD475" : "#D9D8D8",
              flex: 3,
            }}></View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {currentOrder?.status_symbol === OrderStatus.delivered ? (
              <CheckedIcon />
            ) : currentOrder?.status_symbol === OrderStatus.waiting_delivery ? (
              <RefreshIcon />
            ) : (
              <DotIcon />
            )}
          </View>
        </View>
        <View style={s.orderItems}>
          {currentOrder?.items?.map((order, index) => (
            <View key={index.toString()} style={s.orderItemWrapper}>
              <View style={s.itemLeftColumn}>
                <Image style={s.orderItemIcon} source={getImageSource(order.icon_url)} />
                <MyAppText style={s.orderItemTitle}>{order.title}</MyAppText>
              </View>
              <View style={s.orderItemPriceWrapper}>
                <MyAppText style={s.orderItemPrice}>{useFormatPrice(order.price)}</MyAppText>
              </View>
            </View>
          ))}
        </View>
        <View style={s.orderSumWrapper}>
          <MyAppText style={s.orderSumText}>Итого:</MyAppText>
          <MyAppText style={s.orderText}>{useFormatPrice(currentOrder?.sum)}</MyAppText>
        </View>
        {currentOrder?.can_cancel && (
          <TouchableOpacity style={s.cancelOrderButton} onPress={() => setIdForCancelOrder(currentOrder?.id)}>
            <MyAppText style={s.cancelOrder}>Отменить заказ</MyAppText>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
});

const RefreshIcon = () => (
  <View style={[s.iconContainer, s.refreshIconContainer]}>
    <MyIcon styles={s.icon} source={require("icons/refresh.png")} />
  </View>
);
const CheckedIcon = () => (
  <View style={[s.iconContainer, s.checkedIconContainer]}>
    <MyIcon styles={s.icon} source={require("icons/check.png")} />
  </View>
);

const DotIcon = () => (
  <View style={s.dotIconContainer}>
    <View style={s.dotIcon} />
  </View>
);

const s = StyleSheet.create({
  icon: { width: 16, height: 16 },
  dotIcon: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 100,
    width: 5,
    height: 5,
  },
  dotIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9D8D8",
    borderRadius: 100,
    width: 10,
    height: 10,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    width: 30,
    height: 30,
  },
  refreshIconContainer: { backgroundColor: "#F9BE28" },
  checkedIconContainer: { backgroundColor: "#2FD475" },
  orderItemPriceWrapper: { width: "25%", justifyContent: "center", alignItems: "center" },
  orderItemPrice: { fontSize: 16, fontWeight: "500", padding: 10, color: "#383F85" },
  itemLeftColumn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    width: "75%",
  },
  cancelOrderButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#F7F7F7",
    padding: 10,
  },
  cancelOrder: { color: "#817E7E", fontWeight: "500", fontSize: 16 },
  orderItemTitle: { fontSize: 16, fontWeight: "400", color: "#333" },
  orderItemIcon: { width: 50, height: 50, resizeMode: "contain" },
  orderItemWrapper: {
    width: "100%",
    flexDirection: "row",
    borderColor: "#EBE8E8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    marginTop: 5,
    backgroundColor: "#F0F5FD",
  },
  orderItems: { marginTop: 10 },
  container: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "#D9D8D8",
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderText: { fontSize: 18, fontWeight: "600", fontFamily: FontFamily.BOLD, color: "rgba(51, 51, 51, 1)" },
  orderDateText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 5,
    color: "#333333",
    opacity: 0.4,
    fontFamily: FontFamily.BOLD,
    marginLeft: 5,
  },
  orderStatusWrapper: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderStatusTextWrapper: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#FFF9E8",
  },
  orderStatusText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FontFamily.BOLD,
    color: "#F9BE28",
  },
  orderSumWrapper: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  orderSumText: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
    color: "#333333",
  },
});
