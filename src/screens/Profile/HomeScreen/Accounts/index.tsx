import React from "react";
import { observer } from "mobx-react-lite";
import { Image, TouchableOpacity, View, StyleSheet } from "react-native";
import { useFetch } from "src/hooks/useFetch";
import { useRootStore } from "src/hooks/useRootStore";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { CoupledMobileTokens } from "src/stores/authStore/types";

export const Accounts: React.FC<{ coupled_mobile_token: CoupledMobileTokens }> = observer(
  ({ coupled_mobile_token }) => {
    const {
      authStore: { switchAccount },
    } = useRootStore();
    const { token, client_info } = coupled_mobile_token;
    const { invokeApi: invokeSwitchAccount } = useFetch(switchAccount);
    return (
      <TouchableOpacity
        onPress={() => {
          invokeSwitchAccount(token);
        }}
        style={styles.touchable}>
        <View style={styles.leftContainer}>
          <Image style={styles.profileImage} source={require("icons/profileScreen/nonProfilePicture.png")} />
        </View>
        <View style={styles.rightContainer}>
          <MyAppText style={styles.fioText}>{client_info.fio || "ФИО не указано"}</MyAppText>
          {client_info.phone ? (
            <MyAppText style={styles.phoneText}>{client_info.phone}</MyAppText>
          ) : (
            <MyAppText style={styles.unconfirmedPhoneText}>*номер не подтвержден</MyAppText>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  touchable: {
    padding: 10,
    flexDirection: "row",
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 35,
    height: 35,
  },
  rightContainer: {
    flex: 4,
    paddingLeft: 10,
    justifyContent: "space-around",
    position: "relative",
  },
  fioText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: FontFamily.SEMIBOLD,
    color: "#10BBFF",
  },
  phoneText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
    fontFamily: FontFamily.MEDIUM,
  },
  unconfirmedPhoneText: {
    fontSize: 11,
    color: "#838383",
    fontWeight: "500",
    fontFamily: FontFamily.REGULAR,
  },
});
