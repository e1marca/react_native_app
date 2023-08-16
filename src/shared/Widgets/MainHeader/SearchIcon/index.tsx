import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface SearchProps {
  handleSearchPress: () => void;
}

export const SearchIcon = ({ handleSearchPress }: SearchProps) => {
  return (
    <TouchableOpacity onPress={handleSearchPress} style={s.searchIconWrapper}>
      <Image source={require("icons/mainScreen/header/search.png")} />
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  searchIconWrapper: {
    paddingRight: 15,
  },
});
