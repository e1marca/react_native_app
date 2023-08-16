import React, { FC } from "react";
import { Image, ImageSourcePropType, ImageStyle, StyleSheet } from "react-native";

interface MyIconProps {
  source: ImageSourcePropType;
  styles?: ImageStyle;
}

export const MyIcon: FC<MyIconProps> = ({ source, styles }) => {
  return <Image source={source} style={[s.img, styles]} />;
};

const s = StyleSheet.create({
  img: {
    width: 24,
    height: 24,
  },
});
