import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { observer } from "mobx-react-lite";
import React from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useFetch } from "src/hooks/useFetch";
import { useRootStore } from "src/hooks/useRootStore";
import { CartScreens } from "src/screens/Cart/types";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { CurrentOrder } from "src/stores/orderStore/types";
import { AppScreen, AppStackParamList } from "src/screens/types";

interface LastOrderProps {
  item: CurrentOrder;
}

export const LastOrder: React.FC<LastOrderProps> = observer(({ item }) => {
  const {
    cartStore: { repeatOrder },
  } = useRootStore();
  const { invokeApi } = useFetch(repeatOrder);
  const { navigate } = useNavigation<StackNavigationProp<AppStackParamList>>();
  const rotateValue = React.useRef(new Animated.Value(0)).current;
  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleRepeatOrder = async () => {
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    await invokeApi(item._id);
    navigate(AppScreen.Cart, { screen: CartScreens.CART_HOME });
  };

  return (
    <View style={s.container}>
      <View style={s.textWrapper}>
        <MyAppText style={s.title}>Последний заказ</MyAppText>
        <MyAppText style={s.date}>{item.date}</MyAppText>
      </View>
      <TouchableOpacity
        onPress={handleRepeatOrder}
        style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <MyIcon styles={{ width: 18, height: 18, marginRight: 5 }} source={require("icons/mainScreen/repeat.png")} />
        </Animated.View>
        <MyAppText style={s.repeat}>Повторить</MyAppText>
      </TouchableOpacity>
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    margin: 10,
  },
  textWrapper: { flex: 1, marginLeft: 5 },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#323232",
    textAlignVertical: "center",
    fontFamily: FontFamily.BOLD,
  },
  date: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7E7E7E",
    textAlignVertical: "center",
    marginTop: 5,
    fontFamily: FontFamily.SEMIBOLD,
  },
  itemTitles: {
    color: "#7E7E7E",
    fontSize: 16,
    fontWeight: "400",
  },
  repeat: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#10BBFF",
    fontFamily: FontFamily.BOLD,
  },
});
