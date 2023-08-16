import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoadingIndicatorProps {
  size?: "large" | "small";
}
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = "large" }) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
