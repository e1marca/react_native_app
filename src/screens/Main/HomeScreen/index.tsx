import { observer } from "mobx-react-lite";
import React from "react";
import { StyleSheet, View } from "react-native";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { Catalog } from "src/shared/Catalog";
import { Campaign } from "./Campaign";
import { useRootStore } from "src/hooks/useRootStore";
import { CurrentOrder } from "./CurrentOrder";
import { LastOrder } from "./LastOrder";

export const HomeScreen = observer(() => {
  const {
    authStore: {
      mobileToken: {
        company_info: {
          mobile_slider_params: { enabled: slider_enabled },
        },
        current_order,
        client_info: { last_orders },
      },
    },
    catalogStore: { categories },
  } = useRootStore();

  const lastOrder = last_orders?.find(order => order.status_symbol === "delivered");

  const Header = () => (
    <View>
      {slider_enabled && <Campaign />}
      {(current_order && <CurrentOrder />) || (lastOrder && <LastOrder item={lastOrder} />)}
      {!!categories?.length && <MyAppText style={s.title}>Каталог</MyAppText>}
    </View>
  );

  return <Catalog header={<Header />} />;
});

const s = StyleSheet.create({
  container: {
    backgroundColor: "#F4F4F4",
  },
  title: {
    fontWeight: "700",
    fontFamily: FontFamily.BOLD,
    fontSize: 22,
    color: "#3D4250",
    margin: 10,
  },
});
