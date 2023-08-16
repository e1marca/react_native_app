import React from "react";
import { FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Category, CategoryItem } from "src/stores/catalogStore/types";
import { FontFamily, MyAppText } from "../../Widgets/MyAppText";
import { useNavigation } from "@react-navigation/core";
import { CatalogScreens, CatalogStackParamList } from "src/shared/Catalog/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProductList } from "src/shared/Catalog/ProductList";
import { useFetch } from "src/hooks/useFetch";
import { useRootStore } from "src/hooks/useRootStore";

const windowWidth = Dimensions.get("window").width;
const { CATEGORY_SCREEN } = CatalogScreens;
type NavigationProp = StackNavigationProp<CatalogStackParamList>;

export const CategoriesGridScreen: React.FC<{
  categories: Category[];
  generalProducts: CategoryItem[];
  Header?: React.ReactElement;
}> = ({ categories, generalProducts, Header }) => {
  const {
    catalogStore,
    authStore: { getOrUpdateToken },
  } = useRootStore();
  const { navigate } = useNavigation<NavigationProp>();
  const { getCatalog } = catalogStore;
  const { invokeApi, isLoading } = useFetch(getCatalog);
  const { invokeApi: invokeGetOrUpdateToken, isLoading: isLoadingGetOrUpdateToken } = useFetch(getOrUpdateToken);

  const refresh = async () => {
    await invokeGetOrUpdateToken();
    await invokeApi();
  };
  const productList = () => <ProductList products={generalProducts} />;

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={s.itemContainer}
      onPress={() => {
        navigate(CATEGORY_SCREEN, { categoryId: item._id });
      }}>
      <Image source={{ uri: item.icon_url }} style={s.image} />
      <MyAppText style={s.title}>{item.title}</MyAppText>
    </TouchableOpacity>
  );

  return (
    <FlatList
      onRefresh={refresh}
      refreshing={isLoading || isLoadingGetOrUpdateToken}
      ListHeaderComponent={Header}
      ListFooterComponent={(!categories.length && productList) || null}
      data={categories}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      numColumns={2}
    />
  );
};
//
const s = StyleSheet.create({
  itemContainer: {
    flex: 1,
    margin: 5,
    height: windowWidth * 0.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EBE8E8",
  },
  image: {
    width: "80%",
    height: "70%",
    marginBottom: 10,
    resizeMode: "cover",
  },
  title: { color: "#333333", fontFamily: FontFamily.BOLD, fontWeight: "700", fontSize: 16 },
});
