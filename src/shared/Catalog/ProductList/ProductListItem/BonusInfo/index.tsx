import React from "react";
import { StyleSheet, View } from "react-native";
import { useFormatBonus } from "src/hooks/useFormatBonus";
import { MyAppText } from "src/shared/Widgets/MyAppText";
import { CategoryItem } from "src/stores/catalogStore/types";

interface BonusInfoProps {
  item: CategoryItem;
}

export const BonusInfo: React.FC<BonusInfoProps> = ({ item }) => {
  return (
    <View style={s.container}>
      <MyAppText style={s.text}>{useFormatBonus({ bonuses: item.bonus_sum })}</MyAppText>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    backgroundColor: "#10BBFF",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    position: "absolute",
    top: 10,
    left: 0,
    padding: 5,
    paddingHorizontal: 7,
    zIndex: 10,
  },
  text: {
    fontWeight: "600",
    fontSize: 14,
    color: "#FFF",
  },
});
