import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { CartScreens } from "./types";
import { Header } from "src/shared/Widgets/Header";
import { useTranslation } from "react-i18next";
import { CartList } from "./CartList";
import { Checkout } from "./Checkout";
import { OrderForm } from "./OrderForm";
import { observer } from "mobx-react-lite";

const Stack = createStackNavigator();
const { CART_HOME, CHECKOUT, ORDER_FORM } = CartScreens;

const screens = {
  [CART_HOME]: CartList,
  [CHECKOUT]: Checkout,
  [ORDER_FORM]: OrderForm,
};

export const CartScreen = observer(() => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName={CART_HOME}>
      {Object.entries(screens).map(([name, component]) => (
        <Stack.Screen
          key={name}
          name={name}
          component={component}
          options={{
            header: () => <Header hideBackButton={name === CART_HOME} title={t(`Cart:${name}`) as string} />,
          }}
        />
      ))}
    </Stack.Navigator>
  );
});
