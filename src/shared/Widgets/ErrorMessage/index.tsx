import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";

export const ErrorMessage = () => {
  const { t } = useTranslation();

  return (
    <View style={s.container}>
      <View style={s.imageWrapper}>
        <Image source={require("icons/error.png")} />
      </View>
      <View style={s.textWrapper}>
        <MyAppText style={s.text}>{t("General:TryToUpdate") as string}</MyAppText>
        <MyAppText style={s.text}>{t("General:CantOpen") as string}</MyAppText>
      </View>
      {/* <TouchableOpacity activeOpacity={0.7} onPress={handleRefresh} style={s.btnWrapper}>
        <MyAppText style={s.btnText}>{t("General:Update") as string}</MyAppText>
      </TouchableOpacity> */}
    </View>
  );
};

const s = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", height: "100%" },
  textWrapper: { justifyContent: "center", alignItems: "center", marginVertical: 20 },
  text: {
    fontFamily: FontFamily.MEDIUM,
    fontWeight: "500",
    fontSize: 18,
    opacity: 0.5,
    width: "80%",
    textAlign: "center",
    marginBottom: 5,
  },
  btnWrapper: {
    backgroundColor: "#F9BE28",
    padding: 15,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
  },
  btnText: { fontFamily: FontFamily.SEMIBOLD, fontWeight: "400", fontSize: 18, color: "#FFF" },
  imageWrapper: {
    marginTop: 70,
  },
});
