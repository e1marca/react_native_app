import React from "react";
import { View, TouchableOpacity, StyleSheet, Image, ListRenderItemInfo } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getImageSource } from "src/helpers/functions";
import { AppScreen, AppStackParamList } from "src/screens/types";
import { CatalogScreens } from "src/shared/Catalog/types";
import { CartItem } from "src/stores/cartStore/types";
import { ProductQuantity } from "../../../../shared/Widgets/ProductQuantity";
import { observer } from "mobx-react-lite";
import { useFormatPrice } from "src/hooks/useFormatPrice";
import { MyIcon } from "src/shared/Widgets/MyIcon";

const { width } = Dimensions.get("window");
const { PRODUCT_DETAIL_SCREEN } = CatalogScreens;

type NavigationProp = StackNavigationProp<AppStackParamList>;

export const CartListItem: React.FC<{
  itemInfo: ListRenderItemInfo<CartItem>;
  setItemForRemove: (item: CartItem) => void;
}> = observer(({ itemInfo, setItemForRemove }) => {
  const { item, index } = itemInfo;
  const navigation = useNavigation<NavigationProp>();
  const { title, icon_url, price, item_id } = item;
  const handleRemoveItem = () => {
    setItemForRemove(itemInfo.item);
  };
  const chosenToppingsTitles = item.choosen_toppings?.map(ct => ct.title).toString();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate(AppScreen.Catalog, {
          screen: PRODUCT_DETAIL_SCREEN,
          params: { itemId: item_id },
        })
      }
      style={[s.productCard, index === 0 && s.firstProductCart]}>
      <View style={{ flex: 1 }}>
        <Image style={s.productImage} source={getImageSource(icon_url)} />
      </View>
      <View style={s.productInfo}>
        <MyAppText style={s.title}>{title}</MyAppText>
        {chosenToppingsTitles && <MyAppText style={s.descr}>{`+ ${chosenToppingsTitles}`}</MyAppText>}
        <MyAppText style={s.price}>{useFormatPrice(price)}</MyAppText>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}>
          <ProductQuantity item={item} />
          <TouchableOpacity onPress={handleRemoveItem}>
            <MyIcon styles={s.img} source={require("icons/delete.png")} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const s = StyleSheet.create({
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 20,
    marginHorizontal: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0, 0.1)",
    flex: 1,
  },
  firstProductCart: { marginTop: 10 },
  title: { fontSize: 16, fontWeight: "500", color: "#333333" },
  descr: { fontSize: 14, fontWeight: "400", color: "#333333" },
  price: { fontFamily: FontFamily.SEMIBOLD, fontSize: 14, fontWeight: "600", opacity: 0.8, marginVertical: 5 },
  productImage: { width: width * 0.25, height: width * 0.25, resizeMode: "contain" },
  productInfo: {
    justifyContent: "space-around",
    flex: 2.1,
  },
  img: { width: 20, height: 20 },
});
