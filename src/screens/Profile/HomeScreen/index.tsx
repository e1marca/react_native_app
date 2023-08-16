import React, { useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { ProfileScreens, ProfileStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { observer } from "mobx-react-lite";
import { useRootStore } from "src/hooks/useRootStore";
import { InteractiveAssistant } from "./InteractiveAssistant";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { ProfileItemList } from "./ProfileItemList";
import { Accounts } from "./Accounts";
import { useFetch } from "src/hooks/useFetch";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { SignUpScreen } from "../SignUpScreen";

export const HomeScreen = observer(() => {
  const {
    authStore: { mobileToken, isAuthenticated, confirmedAccounts, switchAccount, logout },
    mainStore: { redirectScreen, setRedirectScreen },
  } = useRootStore();
  const { invokeApi: invokeLogout, isLoading: isLoadingLogout } = useFetch(logout);
  const isFocused = useIsFocused();
  const { invokeApi: invokeSwitchAccount, isLoading: isLoadingSwitchAccount } = useFetch(switchAccount);

  useEffect(() => {
    if (!isAuthenticated && !!confirmedAccounts.length && isFocused) {
      const token = confirmedAccounts[confirmedAccounts.length - 1].token;
      invokeSwitchAccount(token);
    }
  }, [confirmedAccounts, invokeSwitchAccount, isAuthenticated, isFocused]);

  const { client_info } = mobileToken;
  const { navigate } = useNavigation<StackNavigationProp<ProfileStackParamList>>();

  useEffect(() => {
    if (redirectScreen && isAuthenticated) {
      navigate(...redirectScreen);
      setRedirectScreen(null);
    }
  }, [isAuthenticated, navigate, setRedirectScreen]);

  if (isLoadingSwitchAccount || isLoadingLogout) {
    return <LoadingIndicator />;
  }

  return (
    <>
      {!isAuthenticated && !confirmedAccounts.length ? (
        <SignUpScreen />
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.profileContainer}>
            <View style={styles.profileHeader}>
              <View style={styles.profileLeft}>
                <Image source={require("icons/profileScreen/nonProfilePicture.png")} />
              </View>
              <View style={styles.profileRight}>
                <TouchableOpacity>
                  <MyAppText style={styles.fioText}>{client_info.fio || "Добавить ФИО"}</MyAppText>
                </TouchableOpacity>
                {client_info.phone ? (
                  <MyAppText style={styles.phoneText}>{client_info.phone}</MyAppText>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      navigate(ProfileScreens.SIGN_UP);
                    }}>
                    <MyAppText style={styles.unconfirmedPhoneText}>*номер не подтвержден</MyAppText>
                    <View style={styles.confirmWarning}>
                      <Image source={require("icons/profileScreen/warning.png")} />
                      <MyAppText style={styles.confirmWarningText}>Подтвердите номер</MyAppText>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity style={styles.editIconContainer}>
                <MyIcon source={require("icons/profileScreen/edit.png")} />
              </TouchableOpacity>
            </View>
            {confirmedAccounts.map(m => (
              <Accounts key={m.token} coupled_mobile_token={m} />
            ))}
            {isAuthenticated && (
              <TouchableOpacity
                onPress={() => {
                  navigate(ProfileScreens.ADD_ACCOUNT);
                }}
                style={styles.addAccount}>
                <MyIcon source={require("icons/profileScreen/add.png")} />
                <MyAppText style={styles.addAccountText}>Добавить аккаунт</MyAppText>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.authenticatedContainer}>{isAuthenticated && <ProfileItemList />}</View>
          {isAuthenticated ? <InteractiveAssistant handleLogout={invokeLogout} /> : null}
          <View>
            <TouchableOpacity style={styles.inviteButton}>
              <MyIcon source={require("icons/profileScreen/invite.png")} />
              <MyAppText style={styles.inviteButtonText}>Пригласи друга</MyAppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailsButton}>
              <MyAppText style={styles.detailsButtonText}>Подробнее</MyAppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  profileContainer: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  profileHeader: {
    padding: 10,
    flexDirection: "row",
  },
  profileLeft: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileRight: { flex: 3, paddingLeft: 20, justifyContent: "center", position: "relative" },
  fioText: { fontSize: 16, color: "#10BBFF", fontWeight: "600", fontFamily: FontFamily.SEMIBOLD, marginBottom: 5 },
  phoneText: { fontSize: 16, color: "#333333", fontWeight: "500", fontFamily: FontFamily.MEDIUM },
  unconfirmedPhoneText: { fontSize: 12, color: "#838383", fontWeight: "500", fontFamily: FontFamily.REGULAR },
  confirmWarning: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  confirmWarningText: {
    fontSize: 14,
    color: "#FF3E3E",
    fontWeight: "400",
    fontFamily: FontFamily.REGULAR,
    marginLeft: 5,
  },
  editIconContainer: { justifyContent: "center", alignItems: "center", paddingRight: 10 },
  addAccount: {
    backgroundColor: "#CBC8C8",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  addAccountText: { fontWeight: "400", fontSize: 16, color: "#121A68", marginLeft: 10 },
  authenticatedContainer: { backgroundColor: "#FFF", paddingHorizontal: 20, borderRadius: 10 },
  inviteButton: {
    padding: 10,
    backgroundColor: "#10BBFF",
    margin: 20,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  inviteButtonText: { fontWeight: "500", fontSize: 16, color: "#FFF", marginLeft: 10 },
  detailsButton: { justifyContent: "center", alignItems: "center", marginBottom: 30 },
  detailsButtonText: { fontWeight: "500", fontSize: 16, color: "#333", marginLeft: 10 },
});
