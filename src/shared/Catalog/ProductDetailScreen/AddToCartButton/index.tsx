import React from "react";
import { StyleSheet, TouchableOpacity, Vibration } from "react-native";
import { FontFamily, MyAppText } from "../../../Widgets/MyAppText";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useFetch } from "src/hooks/useFetch";
import { useNavigation } from "@react-navigation/core";
import { AppScreen, AppStackParamList } from "src/screens/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRootStore } from "src/hooks/useRootStore";
import { useFormatPrice } from "src/hooks/useFormatPrice";
import { CategoryItem } from "src/stores/catalogStore/types";
import { CartScreens } from "src/screens/Cart/types";

type NavigationProp = StackNavigationProp<AppStackParamList>;

export const AddToCartButton: React.FC<{ item: CategoryItem; selectedToppings: CategoryItem[] }> = observer(
  ({ item, selectedToppings }) => {
    const {
      cartStore,
      authStore: {
        mobileToken: {
          company_info: { mobile_to_cart_after_add },
        },
      },
    } = useRootStore();
    const { t } = useTranslation();
    const { cartItems, addProductToCart } = cartStore;
    const { invokeApi, isLoading } = useFetch(addProductToCart);
    const { navigate } = useNavigation<NavigationProp>();

    const selected_topping_ids = selectedToppings.map(st => st._id);

    const handleAddToCart = () => {
      if (isProductInCart()) {
        navigate(AppScreen.Cart, {
          screen: CartScreens.CART_HOME,
        });
      } else {
        Vibration.vibrate(100);
        invokeApi({ item_id: item._id, quantity: 1, topping_ids: selected_topping_ids });
        mobile_to_cart_after_add &&
          navigate(AppScreen.Cart, {
            screen: CartScreens.CART_HOME,
          });
      }
    };

    function arraysEqual(a: string[], b: string[]) {
      if (a.length !== b.length) {
        return false;
      }
      let aCopy = [...a];
      let bCopy = [...b];
      aCopy.sort();
      bCopy.sort();

      return aCopy.every((val, index) => val === bCopy[index]);
    }

    const totalPrice = selectedToppings.reduce((accumulator, item) => accumulator + item.price, 0) + item.price;

    const isProductInCart = () => {
      return cartItems.some(ci => ci._id === item._id && arraysEqual(ci.topping_ids, selected_topping_ids));
    };

    return (
      <TouchableOpacity style={[s.cartButton, isProductInCart() && s.inCart]} onPress={handleAddToCart}>
        <MyAppText style={s.text}>
          {isProductInCart() ? "Товар уже корзине" : `В корзину за ${useFormatPrice(totalPrice)}`}
        </MyAppText>
      </TouchableOpacity>
    );
  }
);

const s = StyleSheet.create({
  cartButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#10BBFF",
    borderRadius: 10,
    padding: 15,
  },
  inCart: {
    backgroundColor: "#F9BE28",
  },
  text: {
    color: "#FFF",
    fontWeight: "400",
    fontFamily: FontFamily.MEDIUM,
    fontSize: 18,
  },
});
