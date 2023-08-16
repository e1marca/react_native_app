import React from "react";
import { View, StyleSheet } from "react-native";
import { Slides } from "src/stores/authStore/types";
import { Image } from "src/stores/catalogStore/types";

interface SliderDotsProps {
  slides: Image[] | Slides[];
  currentIndex: number;
}

export const SliderDots: React.FC<SliderDotsProps> = ({ slides, currentIndex }) => (
  <View style={styles.dotContainer}>
    {slides.map((_, i) => {
      return <View key={_.id} style={[styles.dot, i === currentIndex && styles.activeDot]} />;
    })}
  </View>
);

const styles = StyleSheet.create({
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "#D9D9D9",
  },
  activeDot: {
    backgroundColor: "#FFF",
  },
});
