import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./HomeScreen";
import { observer } from "mobx-react-lite";
import { Header } from "src/shared/Widgets/Header";
import { MainHeader } from "src/shared/Widgets/MainHeader";
import { CatalogScreens } from "src/shared/Catalog/types";
import { CategoryScreen } from "src/shared/Catalog/CategoryScreen";
import { ProductDetailScreen } from "src/shared/Catalog/ProductDetailScreen";
import { useRootStore } from "src/hooks/useRootStore";

const { CATALOG_SCREEN, CATEGORY_SCREEN, PRODUCT_DETAIL_SCREEN } = CatalogScreens;
const Stack = createStackNavigator();

export const CatalogScreen = observer(() => {
  const { catalogStore } = useRootStore();
  const { category } = catalogStore;
  return (
    <Stack.Navigator initialRouteName={CATALOG_SCREEN}>
      <Stack.Screen name={CATALOG_SCREEN} component={HomeScreen} options={{ header: () => <MainHeader /> }} />
      <Stack.Screen
        name={CATEGORY_SCREEN}
        component={CategoryScreen}
        options={{
          header: () => <Header title={category?.title} />,
        }}
      />
      <Stack.Screen
        name={PRODUCT_DETAIL_SCREEN}
        component={ProductDetailScreen}
        options={{ header: () => <MainHeader /> }}
      />
    </Stack.Navigator>
  );
});
