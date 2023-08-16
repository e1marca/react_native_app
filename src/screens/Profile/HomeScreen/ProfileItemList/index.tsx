import React from "react";
import { ProfileScreens } from "../../types";
import { ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppScreen, AppStackParamList } from "src/screens/types";
import { useNavigation } from "@react-navigation/core";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";

const { AUTO_ORDERS, BONUSES, CARDS, ORDERS, PLACES } = ProfileScreens;

const list = [
  { path: ORDERS, title: "История заказов", source: require("icons/profileScreen/history.png") },
  { path: CARDS, title: "Мои карты", source: require("icons/profileScreen/card.png") },
  { path: PLACES, title: "Мои адреса", source: require("icons/profileScreen/place.png") },
  { path: BONUSES, title: "Мои бонусы", source: require("icons/profileScreen/bonus.png") },
  { path: AUTO_ORDERS, title: "Автозаказ", source: require("icons/profileScreen/autoOrder.png") },
];

interface ListItemProps {
  title: string;
  source: ImageSourcePropType;
  path: ProfileScreens;
}

const ListItem = ({ title, source, path }: ListItemProps) => {
  const { navigate } = useNavigation<StackNavigationProp<AppStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigate(AppScreen.Profile, { screen: path });
      }}
      style={styles.itemContainer}>
      <MyIcon source={source} />
      <MyAppText style={styles.itemText}>{title}</MyAppText>
    </TouchableOpacity>
  );
};

export const ProfileItemList = () => {
  return (
    <View>
      {list.map(({ path, title, source }) => (
        <ListItem key={path} path={path} title={title} source={source} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "400",
    fontFamily: FontFamily.MEDIUM,
  },
});
