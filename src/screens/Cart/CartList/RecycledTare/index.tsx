import { observer } from "mobx-react-lite";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRootStore } from "src/hooks/useRootStore";
import { MyAppText } from "src/shared/Widgets/MyAppText";

export const RecycledTare = observer(() => {
  const {
    authStore: { mobileToken },
    cartStore: {
      addCoupled,
      cart: { need_coupled_count },
    },
  } = useRootStore();

  const {
    company_info: { cart_coupled },
  } = mobileToken;

  return (
    <View style={s.wrapper}>
      <View style={s.header}>
        <MyAppText style={s.text}>
          {cart_coupled.need_tare_txt.replace("{{need_coupled_count}}", need_coupled_count.toString())}
        </MyAppText>
      </View>
      <TouchableOpacity style={s.btn} onPress={addCoupled}>
        <MyAppText style={s.btnText}>{cart_coupled.add_tare_btn_txt}</MyAppText>
      </TouchableOpacity>
    </View>
  );
});

const s = StyleSheet.create({
  wrapper: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#d9d9d9" },
  header: { alignItems: "center", marginBottom: 10 },
  text: { fontSize: 14, fontWeight: "400", color: "#333333", width: "70%", textAlign: "center", lineHeight: 20 },
  btn: { backgroundColor: "#10BBFF", padding: 10, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  btnText: { fontSize: 18, fontWeight: "600", color: "#FFF" },
});
