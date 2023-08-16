import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { CartListItem } from "./CartListItem";
import { observer } from "mobx-react-lite";
import { NoProductsInCart } from "./NoProductsInCart";
import { OrderSummary } from "./OrderSummary";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { useRootStore } from "src/hooks/useRootStore";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { CartScreens, CartStackParamList } from "../types";
import { AppScreen, AppStackParamList } from "src/screens/types";
import useNavigateAndSaveScreen from "src/hooks/useNavigateAndSaveScreen";
import { RecycledTare } from "./RecycledTare";
import { CartItem } from "src/stores/cartStore/types";
import { useFetch } from "src/hooks/useFetch";
import { ConfirmModal } from "src/shared/Modals/ConfirmModal";
import { useFormatPrice } from "src/hooks/useFormatPrice";
import { ProfileScreens } from "src/screens/Profile/types";

export const CartList: React.FC = observer(() => {
  const {
    cartStore: { cartItems, cart, removeProductFromCart },
    authStore: {
      isAuthenticated,
      mobileToken: {
        company_info: { mobile_min_sum },
      },
    },
  } = useRootStore();
  const { invokeApi, isLoading } = useFetch(removeProductFromCart);
  const { navigate } = useNavigation<StackNavigationProp<CartStackParamList & AppStackParamList>>();
  const navigateAndSaveScreen = useNavigateAndSaveScreen();
  const handleNavigate = () => {
    isAuthenticated
      ? navigate(CartScreens.CHECKOUT, { addressAdded: false })
      : navigateAndSaveScreen({
          currentScreen: [AppScreen.Cart, { screen: CartScreens.CART_HOME }],
          targetScreen: [AppScreen.Profile, { screen: ProfileScreens.PROFILE_HOME }],
        });
  };

  const isMakeOrderBtnDisabled = isAuthenticated && mobile_min_sum > cart.total_sum;

  const [itemForRemove, setItemForRemove] = useState<CartItem | null>(null);

  const handleRemoveItem = () => {
    invokeApi(itemForRemove!._id, itemForRemove!.topping_ids);
    setItemForRemove(null);
  };
  console.log("mobile_min_sum", mobile_min_sum);
  return (
    <View style={s.container}>
      <ConfirmModal
        visible={!!itemForRemove}
        title="Удалить из корзины?"
        handleCancel={() => setItemForRemove(null)}
        handleConfirm={handleRemoveItem}
      />
      {cartItems && cartItems.length ? (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 3 }}>
            <FlatList
              data={cartItems}
              renderItem={itemInfo => <CartListItem itemInfo={itemInfo} setItemForRemove={setItemForRemove} />}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
              ListFooterComponent={
                <View style={s.completeOrder}>
                  {cart.need_coupled_count > 0 && <RecycledTare />}
                  <OrderSummary />
                  {!isAuthenticated && (
                    <MyAppText style={{ fontSize: 16, fontWeight: "400", marginBottom: 10 }}>
                      Войдите, чтобы оформить заказ
                    </MyAppText>
                  )}
                  <TouchableOpacity
                    activeOpacity={0.5}
                    disabled={isMakeOrderBtnDisabled}
                    style={[s.button, isMakeOrderBtnDisabled && s.buttonDisabled]}
                    onPress={handleNavigate}>
                    <MyAppText style={s.buttonText}>{`${
                      isAuthenticated ? "Оформить заказ" : "Авторизоваться"
                    }`}</MyAppText>
                  </TouchableOpacity>
                  {isMakeOrderBtnDisabled && (
                    <MyAppText style={{ fontSize: 16, fontWeight: "400", marginTop: 10, color: "#E74040" }}>
                      {`МИНИМАЛЬНАЯ СУММА ЗАКАЗА: ${useFormatPrice(mobile_min_sum)}`}
                    </MyAppText>
                  )}
                </View>
              }
            />
          </View>
        </View>
      ) : (
        <NoProductsInCart />
      )}
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  completeOrder: {
    paddingBottom: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#F9BE28",
    padding: 13,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonDisabled: { backgroundColor: "#D2CFC8" },
  buttonText: {
    fontFamily: FontFamily.SEMIBOLD,
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});
