import React, { useCallback, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Vibration } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CatalogScreens, CatalogStackParamList } from "../../types";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { CategoryItem } from "src/stores/catalogStore/types";
import { Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Price } from "src/shared/Widgets/Price";
import { getImageSource, truncateText } from "src/helpers/functions";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { observer } from "mobx-react-lite";
import { useRootStore } from "src/hooks/useRootStore";
import { ProductQuantity } from "src/shared/Widgets/ProductQuantity";
import { useFetch } from "src/hooks/useFetch";
import { BonusInfo } from "./BonusInfo";
import { AppScreen, AppStackParamList } from "src/screens/types";
import { CartScreens } from "src/screens/Cart/types";

const { width } = Dimensions.get("window");
const { PRODUCT_DETAIL_SCREEN } = CatalogScreens;

type NavigationProp = StackNavigationProp<CatalogStackParamList & AppStackParamList>;

export const ProductsListItem: React.FC<{
  item: CategoryItem;
}> = observer(({ item }) => {
  const { navigate } = useNavigation<NavigationProp>();
  const { price_old, actual_price, title, icon_url, descr, has_toppings, toppings } = item;
  const {
    cartStore: { cartItems, addProductToCart },
    catalogStore: { setUserSearchResults },
    authStore: {
      mobileToken: {
        company_info: { mobile_to_cart_after_add },
      },
    },
  } = useRootStore();
  const { invokeApi: invokeAddProductToCart } = useFetch(addProductToCart);
  const isProductInCart = useCallback(() => {
    return cartItems.some(i => i._id === item._id);
  }, [cartItems, item]);

  const getCurrentProdductFromCart = useCallback(() => {
    return cartItems.filter(i => i._id === item._id)[0];
  }, [cartItems, item]);

  const iconSource = isProductInCart()
    ? require("icons/catalogScreen/inCart.png")
    : require("icons/catalogScreen/addToCart.png");

  const handleAddToCart = () => {
    Vibration.vibrate(100);
    invokeAddProductToCart({ item_id: item._id, quantity: 1 });
    mobile_to_cart_after_add &&
      navigate(AppScreen.Cart, {
        screen: CartScreens.CART_HOME,
      });
  };
  const handleOpenProductDetails = () => {
    navigate(PRODUCT_DETAIL_SCREEN, { itemId: item._id });
    setUserSearchResults(null);
  };

  return (
    <View>
      <TouchableOpacity activeOpacity={0.9} onPress={handleOpenProductDetails} style={s.productCard}>
        {!!item.bonus_sum && <BonusInfo item={item} />}
        <View style={s.productImageWrapper}>
          <Image style={s.productImage} source={getImageSource(icon_url)} />
        </View>
        <View style={s.productInfo}>
          <MyAppText style={s.title}>{title}</MyAppText>
          {descr && <MyAppText style={s.descr}>{truncateText(descr, 70)}</MyAppText>}
          <View style={s.priceContainer}>
            <Price price_old={price_old} actual_price={actual_price} oldPricefontSize={13} actualPriceFontSize={16} />
          </View>
          {isProductInCart() && !toppings.length && <ProductQuantity item={getCurrentProdductFromCart()} />}
        </View>
        {!toppings.length && (
          <TouchableOpacity
            disabled={isProductInCart()}
            onPress={handleAddToCart}
            style={[s.buttonWrapper, isProductInCart() && s.productInCart]}>
            <MyIcon styles={{ width: 24, height: 24 }} source={iconSource} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
});

const s = StyleSheet.create({
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  title: { fontSize: 16, fontWeight: "500", color: "#333333", fontFamily: FontFamily.MEDIUM },
  descr: { fontSize: 14, fontWeight: "400", color: "#8E8E8E", marginVertical: 5 },
  productImageWrapper: {
    flex: 3,
  },
  productImage: { width: width * 0.25, height: width * 0.25, resizeMode: "center" },
  productInfo: {
    flex: 5,
    justifyContent: "space-around",
  },
  priceContainer: { marginBottom: 5 },
  buttonWrapper: {
    backgroundColor: "#10BBFF",
    padding: 7,
    borderRadius: 100,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  productInCart: {
    backgroundColor: "#F9BE28",
  },
});
