import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { observer } from "mobx-react-lite";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRootStore } from "src/hooks/useRootStore";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { MainScreenStackParamList, MainScreens } from "../../types";

export const CurrentOrder = observer(() => {
  const {
    authStore: { currentOrder },
  } = useRootStore();
  const navigation = useNavigation<StackNavigationProp<MainScreenStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(MainScreens.ORDER_DETAILS_SCREEN);
      }}
      style={s.container}>
      <MyIcon styles={{ width: 32, height: 32 }} source={require("icons/delivery.png")} />
      <View style={s.textWrapper}>
        <MyAppText style={s.title}>Текущий заказ</MyAppText>
      </View>
      <View style={{ flex: 1 }}>
        <MyAppText style={s.status}>{currentOrder.status}</MyAppText>
      </View>
    </TouchableOpacity>
  );
});

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    margin: 10,
  },
  textWrapper: { flexDirection: "row", flex: 1 },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#323232",
    textAlignVertical: "center",
    marginLeft: 5,
    fontFamily: FontFamily.BOLD,
  },
  itemTitles: {
    color: "#7E7E7E",
    fontSize: 16,
    fontWeight: "400",
  },
  status: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#F9BE28",
    fontFamily: FontFamily.BOLD,
  },
});
