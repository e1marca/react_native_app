import React from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet, View } from "react-native";
import { MyAppText } from "src/shared/Widgets/MyAppText";
import { useFormatBonus } from "src/hooks/useFormatBonus";

interface HeaderBonusInfo {
  bonuses: number;
}

export const HeaderBonusInfo: React.FC<HeaderBonusInfo> = observer(({ bonuses }) => {
  return (
    <View style={s.container}>
      <MyAppText style={s.text}>{useFormatBonus({ bonuses, displayPrefix: false })}</MyAppText>
    </View>
  );
});
const s = StyleSheet.create({
  container: {
    backgroundColor: "#10BBFF",
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginRight: 10,
  },
  text: {
    fontWeight: "700",
    fontSize: 16,
    color: "#FFF",
  },
});
