import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MainScreens } from "./types";
import { HomeScreen } from "./HomeScreen";
import { MainHeader } from "src/shared/Widgets/MainHeader";
import { CategoryScreen } from "src/shared/Catalog/CategoryScreen";
import { Header } from "src/shared/Widgets/Header";
import { observer } from "mobx-react-lite";
import { ProductDetailScreen } from "src/shared/Catalog/ProductDetailScreen";
import { useRootStore } from "src/hooks/useRootStore";
import { OrderDetailsScreen } from "./OrderDetailsScreen";

const Stack = createStackNavigator();
const { HOME_SCREEN, CATEGORY_SCREEN, PRODUCT_DETAIL_SCREEN, ORDER_DETAILS_SCREEN } = MainScreens;

const header = () => <MainHeader />;

export const MainScreen = observer(() => {
  const { catalogStore } = useRootStore();
  const { category } = catalogStore;

  return (
    <Stack.Navigator initialRouteName={HOME_SCREEN}>
      <Stack.Screen name={HOME_SCREEN} component={HomeScreen} options={{ header }} />
      <Stack.Screen
        name={CATEGORY_SCREEN}
        component={CategoryScreen}
        options={{
          header: () => <Header title={category?.title} />,
        }}
      />
      <Stack.Screen name={PRODUCT_DETAIL_SCREEN} component={ProductDetailScreen} options={{ header }} />
      <Stack.Screen name={ORDER_DETAILS_SCREEN} component={OrderDetailsScreen} options={{ header }} />
    </Stack.Navigator>
  );
});
