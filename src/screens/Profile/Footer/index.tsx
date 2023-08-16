import { observer } from "mobx-react-lite";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { CitySelector } from "../CitySelector";

export const Footer = observer(() => {
  return (
    <View style={s.footer}>
      <View style={s.footerButtonsContainer}>
        <TouchableOpacity>
          <MyAppText style={s.info}>Позвонить</MyAppText>
        </TouchableOpacity>
        <TouchableOpacity>
          <MyAppText style={s.info}>Информация</MyAppText>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={s.inviteButton}>
        <MyIcon styles={s.img} source={require("icons/profileScreen/invite.png")} />
        <MyAppText style={s.inviteButtonText}>Пригласи друга</MyAppText>
      </TouchableOpacity>
      <View style={s.citySelector}>
        <CitySelector />
      </View>
    </View>
  );
});

const s = StyleSheet.create({
  citySelector: { width: "100%", marginTop: 30 },
  container: { paddingHorizontal: 20, backgroundColor: "#F5F5F5", paddingVertical: 10, flex: 1 },
  img: { tintColor: "#10BBFF" },
  info: {
    color: "#555555",
    textAlign: "center",
    marginTop: 5,
    fontWeight: "400",
    fontSize: 14,
  },
  inviteButton: {
    padding: 12,
    borderRadius: 69,
    marginTop: 20,
    borderColor: "#10BBFF",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  inviteButtonText: {
    color: "#10BBFF",
    fontFamily: FontFamily.MEDIUM,
    fontWeight: "500",
    textAlignVertical: "center",
    marginLeft: 10,
    fontSize: 16,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
    alignItems: "center",
  },
  footerButtonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
});
