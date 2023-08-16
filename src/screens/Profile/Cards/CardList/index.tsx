import { observer } from "mobx-react-lite";
import React from "react";
import { FlatList, ListRenderItemInfo, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRootStore } from "src/hooks/useRootStore";
import { MyAppText } from "src/shared/Widgets/MyAppText";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { PaymentCard } from "src/stores/authStore/types";

export const CardList = observer(() => {
  const {
    authStore: {
      mobileToken: {
        client_info: { cards },
      },
    },
  } = useRootStore();

  const renderItem = ({ item }: ListRenderItemInfo<PaymentCard>) => {
    const { title } = item;
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemTitleContainer}>
          <MyIcon source={require("icons/profileScreen/payment-card.png")} />
          <MyAppText style={styles.itemTitle}>{title}</MyAppText>
        </View>
        <TouchableOpacity>
          <MyIcon styles={styles.deleteIcon} source={require("icons/delete.png")} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList data={cards} renderItem={renderItem} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  itemContainer: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#F2F2F2",
  },
  itemTitleContainer: {
    flexDirection: "row",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
});
