import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { observer } from "mobx-react-lite";
import React from "react";
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useBackButtonHandler } from "src/hooks/useBackButtonHandler";
import { useRootStore } from "src/hooks/useRootStore";
import { AppStackParamList } from "src/screens/types";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";

interface HeaderProps {
  title?: string;
  hideBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = observer(({ title, hideBackButton = false }) => {
  return (
    <SafeAreaView>
      <View style={s.wrapper}>
        <TouchableOpacity disabled={hideBackButton} onPress={useBackButtonHandler()} style={s.backButton}>
          {!hideBackButton && <Image source={require("icons/arrowLeft.png")} />}
        </TouchableOpacity>
        <MyAppText style={s.text}>{title}</MyAppText>
        <View />
      </View>
    </SafeAreaView>
  );
});

const s = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#fff",
  },
  backButton: { padding: 15, position: "absolute", left: 10 },
  text: { fontFamily: FontFamily.SEMIBOLD, fontSize: 20, fontWeight: "600", padding: 12 },
});
