import React from "react";
import { View, StyleSheet } from "react-native";

interface RadioButtonProps {
  isSelected: boolean;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ isSelected }) => (
  <View style={styles.container}>
    <View style={styles.outerCircle}>
      <View style={[styles.innerCircle, isSelected && styles.selected]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center" },
  outerCircle: {
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#10BBFF",
    marginRight: 10,
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: "#FFF",
  },
  selected: {
    backgroundColor: "#10BBFF",
  },
});
