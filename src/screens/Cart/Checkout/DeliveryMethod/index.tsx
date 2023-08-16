import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { MobileDeliveryType } from "src/stores/authStore/types";

interface DeliveryMethodProps {
  name: MobileDeliveryType.only_delivery | MobileDeliveryType.only_pickup;
}

export const DeliveryMethod: React.FC<DeliveryMethodProps> = ({ name }) => {
  const { t } = useTranslation();

  const getIconSource = () => {
    if (name === MobileDeliveryType.only_delivery) {
      return require("icons/cartScreen/only_delivery.png");
    }
    return require("icons/cartScreen/only_pickup.png");
  };

  return (
    <View style={s.container}>
      <View style={s.wrapper}>
        <MyIcon source={getIconSource()} />
        <MyAppText style={s.text}>{t(`Cart:${name}`) as string}</MyAppText>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { marginBottom: 10 },
  wrapper: {
    padding: 10,
    backgroundColor: "#FCF7F7",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10BBFF",
    fontFamily: FontFamily.MEDIUM,
    marginLeft: 5,
  },
});
