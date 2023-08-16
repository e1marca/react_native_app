import React, { FC } from "react";
import { Dimensions, Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
const height = Dimensions.get("screen").height;

interface EmptyScreenProps {
  title?: string;
  imageSource: ImageSourcePropType;
  handleNavigate?: () => void;
  buttonText?: string;
  styles?: ViewStyle;
}
export const EmptyScreen: FC<EmptyScreenProps> = ({ title, imageSource, handleNavigate, buttonText, styles }) => {
  return (
    <View style={[s.container, { ...styles }]}>
      {title && <MyAppText style={s.text}>{title}</MyAppText>}
      {buttonText && (
        <TouchableOpacity onPress={handleNavigate} style={s.btnWrapper}>
          <MyAppText style={s.btnText}>{buttonText}</MyAppText>
        </TouchableOpacity>
      )}
      <View style={s.imageWrapper}>
        <Image source={imageSource} />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", height: height * 0.8 },
  text: {
    fontFamily: FontFamily.MEDIUM,
    fontWeight: "500",
    fontSize: 18,
    opacity: 0.5,
    width: "80%",
    textAlign: "center",
  },
  btnWrapper: {
    borderWidth: 1,
    borderColor: "#10BBFF",
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
  },
  btnText: { fontFamily: FontFamily.REGULAR, fontWeight: "400", fontSize: 16, color: "#10BBFF" },
  imageWrapper: {
    // marginTop: 70,
  },
});
