import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { ProfileScreens, ProfileStackParamList } from "../types";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRootStore } from "src/hooks/useRootStore";
import { Footer } from "../Footer";
import { formatPhoneNumber } from "src/helpers/functions";
import { LoginType } from "src/stores/authStore/types";

type NavigationProp = StackNavigationProp<ProfileStackParamList>;

export const SignUpScreen = observer(() => {
  const {
    authStore: { userNumberForLogin, setUserNumberForLogin, authType },
  } = useRootStore();
  const navigation = useNavigation<NavigationProp>();
  const phoneInput = useRef<TextInput>(null);

  const handleOnChangeText = (value: string) => {
    const formattedPhoneNumber = formatPhoneNumber(value);
    setUserNumberForLogin(formattedPhoneNumber);
  };
  const { phones_login_info } = authType!;

  const numLength = () => phones_login_info.phone_mask_nums_length - phones_login_info.phone_start.length;
  const nonNumericCount = userNumberForLogin.replace(/\d/g, "").length;

  const getButtonDisabled = () => userNumberForLogin.length !== numLength() + nonNumericCount;

  const handleNavigate = () => {
    authType?.login_type === LoginType.sms && navigation.navigate(ProfileScreens.SMS_LOGIN);
    authType?.login_type === LoginType.client_call && navigation.navigate(ProfileScreens.PHONE_CALL_LOGIN);
  };

  useEffect(() => {
    setTimeout(() => phoneInput.current?.focus(), 100);
  }, []);

  return (
    <View style={s.container}>
      <View style={s.flexContainer}>
        <MyAppText style={s.descr}>Вы не вошли в систему, войдите</MyAppText>
        <View style={s.phoneContainer}>
          <MyAppText style={s.phonePrefix}>{`+${authType?.phones_login_info.phone_start}`}</MyAppText>
          <TextInput
            ref={phoneInput}
            keyboardType="numeric"
            onChangeText={handleOnChangeText}
            value={userNumberForLogin}
            style={s.phoneInput}
            maxLength={numLength() + nonNumericCount}
            placeholder="Номер телефона"
          />
        </View>
        <TouchableOpacity
          disabled={getButtonDisabled()}
          style={[s.enterButton, getButtonDisabled() && s.disabledButton]}
          onPress={handleNavigate}>
          <MyAppText style={s.enterText}>Продолжить</MyAppText>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
});

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, backgroundColor: "#F5F5F5", paddingVertical: 10, flex: 1 },
  flexContainer: { flex: 1 },
  descr: {
    fontSize: 18,
    color: "#10BBFF",
    fontWeight: "500",
    marginTop: 40,
    textAlign: "center",
    marginHorizontal: 40,
  },
  enter: {
    fontSize: 18,
    color: "#3D4250",
    fontWeight: "400",
    marginTop: 30,
    textAlign: "center",
  },
  phoneContainer: {
    borderWidth: 1,
    borderColor: "#E7E7E7",
    marginTop: 30,
    backgroundColor: "#FFF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  phonePrefix: {
    fontSize: 16,
    fontFamily: FontFamily.MEDIUM,
    fontWeight: "500",
    backgroundColor: "#F3EDED",
    color: "#383838",
    textAlign: "center",
    textAlignVertical: "center",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    paddingVertical: 15,
  },
  phoneInput: {
    fontSize: 16,
    fontFamily: FontFamily.MEDIUM,
    fontWeight: "500",
    color: "#383838",
    flex: 6,
    letterSpacing: 1,
    paddingLeft: 15,
  },
  enterButton: { padding: 15, backgroundColor: "#383F85", borderRadius: 10, marginTop: 20 },
  disabledButton: { opacity: 0.5 },
  enterText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
});
