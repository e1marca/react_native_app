import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRootStore } from "src/hooks/useRootStore";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { useNavigation } from "@react-navigation/core";
import { ProfileScreens, ProfileStackParamList } from "../types";
import { Footer } from "../Footer";
import { StackNavigationProp } from "@react-navigation/stack";

export const PhoneAuth = observer(() => {
  const {
    authStore: { mobileToken, isAuthenticated },
  } = useRootStore();
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();

  useEffect(() => {
    if (mobileToken && isAuthenticated) {
      navigation.navigate(ProfileScreens.PROFILE_HOME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileToken, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MyAppText style={styles.headerText}>Выберите способ подтверждения номера</MyAppText>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate(ProfileScreens.PHONE_CALL_LOGIN)}>
          <MyAppText style={styles.optionButtonText}>Перезвонить на наш номер</MyAppText>
        </TouchableOpacity>
        <View>
          <MyAppText style={styles.orText}>или</MyAppText>
          <TouchableOpacity onPress={() => navigation.navigate(ProfileScreens.SMS_LOGIN)}>
            <MyAppText style={styles.linkText}>Отправить код на номер</MyAppText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MyAppText style={styles.cancelText}>Отменить</MyAppText>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-around",
  },
  headerText: {
    fontWeight: "500",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    marginHorizontal: 50,
    color: "#10BBFF",
    marginTop: 30,
  },
  optionButton: {
    backgroundColor: "#383F85",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#F7F7F7",
    padding: 15,
    borderRadius: 10,
  },
  orText: {
    fontWeight: "400",
    fontSize: 18,
    textAlign: "center",
    color: "#3D4250",
    marginBottom: 20,
  },
  linkText: {
    fontWeight: "400",
    fontSize: 18,
    textAlign: "center",
    color: "#3D4250",
    textDecorationLine: "underline",
  },
  cancelText: {
    fontWeight: "400",
    fontSize: 16,
    textAlign: "center",
    color: "#000",
    opacity: 0.5,
    fontFamily: FontFamily.SEMIBOLD,
  },
});
