import { observer } from "mobx-react-lite";
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useRootStore } from "src/hooks/useRootStore";

export const AppLogo = observer(() => {
  const {
    authStore: { mobileToken },
  } = useRootStore();

  const {
    company_info: { mobile_menu_logo_url },
  } = mobileToken;

  return <View>{mobile_menu_logo_url && <Image style={s.img} source={{ uri: mobile_menu_logo_url }} />}</View>;
});

const s = StyleSheet.create({
  img: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
});
