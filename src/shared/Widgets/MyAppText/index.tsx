import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

export enum FontFamily {
  REGULAR = "Gilroy-Regular",
  MEDIUM = "Gilroy-Medium",
  SEMIBOLD = "Gilroy-Semibold",
  BOLD = "Gilroy-Bold",
}

interface RequiredTextStyles extends TextStyle {
  fontSize: Extract<TextStyle["fontSize"], number>;
  fontWeight: Extract<TextStyle["fontWeight"], string>;
  fontFamily?: FontFamily;
}
interface MyAppTextProps {
  children?: string | number;
  style: RequiredTextStyles;
}
export const MyAppText: React.FC<MyAppTextProps> = ({ children, style }) => {
  return <Text style={[s.textStyle, style]}>{children}</Text>;
};

const s = StyleSheet.create({
  textStyle: {
    fontSize: 14,
    fontFamily: FontFamily.REGULAR,
    color: "#000",
  },
});
