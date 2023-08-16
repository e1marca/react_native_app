import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import { useFetch } from "src/hooks/useFetch";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { Price } from "src/shared/Widgets/Price";
import { CatalogScreens, CatalogStackParamList } from "../types";
import { ErrorMessage } from "src/shared/Widgets/ErrorMessage";
import { getImageSource } from "src/helpers/functions";
import { useTranslation } from "react-i18next";
import { useRootStore } from "src/hooks/useRootStore";
import { useFormatPrice } from "src/hooks/useFormatPrice";
import { CategoryItem } from "src/stores/catalogStore/types";
import { AddToCartButton } from "./AddToCartButton";
import { useFormatBonus } from "src/hooks/useFormatBonus";
import { SliderDots } from "src/shared/Widgets/SliderDots";
import { withUserSearchResults } from "src/hoc/WithUserSearchResults";

const { width } = Dimensions.get("window");
const { PRODUCT_DETAIL_SCREEN } = CatalogScreens;

const ProductDetails: React.FC = observer(() => {
  const route = useRoute<RouteProp<CatalogStackParamList, typeof PRODUCT_DETAIL_SCREEN>>();
  const {
    params: { itemId },
  } = route;
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const { catalogStore } = useRootStore();
  const { getProductDetails, productDetails } = catalogStore;
  const { invokeApi, isLoading } = useFetch(getProductDetails);
  const [selectedToppings, setSelectedToppings] = useState<CategoryItem[]>([]);

  useEffect(() => {
    invokeApi(itemId);
  }, [invokeApi, itemId]);

  const handleSelectTopping = (tp: CategoryItem) => {
    if (selectedToppings.some(st => st._id === tp._id)) {
      setSelectedToppings(prev => prev.filter(st => st._id !== tp._id));
    } else {
      setSelectedToppings(prev => [...prev, tp]);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  if (!productDetails) {
    return <ErrorMessage />;
  }

  const { images, title, descr, price_old, actual_price, price_conditions, toppings, bonus_sum } = productDetails;

  return (
    <View style={s.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={s.arrowLeftWrapper}>
        <Image source={require("icons/arrowLeft.png")} />
      </TouchableOpacity>
      <ScrollView style={s.productWrapper}>
        <View>
          {images.length ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              style={{ width }}
              data={productDetails.images}
              keyExtractor={(item, index) => index.toString()}
              onScroll={({ nativeEvent }) => {
                const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
                if (slide !== currentIndex) {
                  setCurrentIndex(slide);
                }
              }}
              renderItem={({ item }) => (
                <View style={s.productImageWrapper}>
                  <Image source={getImageSource(item.original)} style={s.productImage} />
                </View>
              )}
            />
          ) : (
            <View style={s.emptyImageWrapper}>
              <Image source={getImageSource(null)} />
            </View>
          )}
          <SliderDots currentIndex={currentIndex} slides={images} />
        </View>
        <View style={s.info}>
          <MyAppText style={s.title}>{title}</MyAppText>
          <View style={s.priceContainer}>
            <Price price_old={price_old} actual_price={actual_price} actualPriceFontSize={20} oldPricefontSize={16} />
            <MyAppText style={s.bonusText}>{useFormatBonus({ bonuses: bonus_sum })}</MyAppText>
          </View>
          <View style={s.quantityButtons}>
            {price_conditions?.map(({ price, quantity }, index) => (
              <TouchableOpacity key={index} onPress={() => {}} style={s.addButton}>
                <Text style={s.buttonText}>
                  +{quantity} {t("Cart:QuantityShort")} {useFormatPrice(price)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <MyAppText style={s.descr}>{descr?.trim()}</MyAppText>
          <View style={s.toppingsWrapper}>
            {toppings.map(tp => (
              <TouchableOpacity
                key={tp._id}
                onPress={() => handleSelectTopping(tp)}
                style={[s.toppingItem, selectedToppings.some(st => st._id === tp._id) && s.selectedTopping]}>
                <Image source={getImageSource(tp.icon_url)} style={s.toppingImage} />
                <MyAppText style={s.toppingTitle}>{tp.title}</MyAppText>
                <MyAppText style={s.toppingPrice}>{useFormatPrice(tp.price)}</MyAppText>
                {selectedToppings.some(st => st._id === tp._id) && (
                  <View style={s.checkedToppingImg}>
                    <Image source={require("icons/cartScreen/checked.png")} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={s.buttonContainer}>
        <AddToCartButton item={productDetails} selectedToppings={selectedToppings} />
      </View>
    </View>
  );
});

export const ProductDetailScreen = withUserSearchResults(ProductDetails);

const s = StyleSheet.create({
  container: { flex: 1 },
  productWrapper: { backgroundColor: "#F4F4F4" },
  info: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    fontFamily: FontFamily.SEMIBOLD,
    paddingBottom: 10,
  },
  descr: { fontWeight: "400", fontSize: 14, lineHeight: 20 },
  buttonContainer: {
    backgroundColor: "#FEFEFE",
    height: 100,
    justifyContent: "center",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  productImageWrapper: {
    width: width,
    height: width * 0.4,
  },
  productImage: {
    resizeMode: "contain",
    width: width,
    height: width * 0.4,
  },
  emptyImageWrapper: { justifyContent: "center", alignItems: "center", width: width, height: width * 0.4 },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bonusText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#10BBFF",
    marginLeft: 10,
  },
  quantityButtons: {
    flexDirection: "row",
    marginVertical: 10,
  },
  addButton: {
    borderRadius: 4,
    borderColor: "#C8C5C5",
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  buttonText: {
    color: "#585858",
    fontSize: 14,
    fontWeight: "500",
  },
  arrowLeftWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 15,
    top: 15,
    backgroundColor: "#fff",
    width: 41,
    height: 41,
    borderRadius: 100,
    zIndex: 1,
  },
  toppingsWrapper: { flexDirection: "row", justifyContent: "space-around" },
  toppingItem: {
    width: width * 0.4,
    borderWidth: 1,
    height: width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: "#fefefe",
    borderColor: "#fefefe",
  },
  selectedTopping: {
    borderColor: "#32E97E",
  },
  toppingImage: { resizeMode: "contain", width: width * 0.2, height: width * 0.2 },
  toppingTitle: { fontSize: 14, fontWeight: "400", textAlign: "center", marginTop: 5 },
  toppingPrice: { fontSize: 16, fontWeight: "600", textAlign: "center", marginTop: 5 },
  checkedToppingImg: { position: "absolute", top: 5, right: 5 },
});
