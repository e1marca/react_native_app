import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useRef } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { ProfileScreens, ProfileStackParamList } from "../types";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRootStore } from "src/hooks/useRootStore";
import { Footer } from "../Footer";
import { formatPhoneNumber } from "src/helpers/functions";
import { LoginType } from "src/stores/authStore/types";
import { useFetch } from "src/hooks/useFetch";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";

type NavigationProp = StackNavigationProp<ProfileStackParamList>;

export const AddAccount = observer(() => {
  const {
    authStore: {
      userNumberForLogin,
      setUserNumberForLogin,
      authType,
      createCoupledToken,
      rawUserNumberForLogin,
      confirmedAccounts,
      currentCity,
    },
  } = useRootStore();
  const phoneInput = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp>();
  const { invokeApi: invokeCreateCoupledToken, isLoading: isloadingCreateCoupledToken } = useFetch(createCoupledToken);

  const handleOnChangeText = (value: string) => {
    setUserNumberForLogin(formatPhoneNumber(value));
  };

  const { phone_mask_nums_length, phone_start } = authType?.phones_login_info || {};
  const numberLength = phone_mask_nums_length - phone_start.length;
  const nonNumericCount = userNumberForLogin.replace(/\d/g, "").length;

  useEffect(() => {
    invokeCreateCoupledToken();
  }, [invokeCreateCoupledToken]);

  const handleNavigate = useCallback(() => {
    if (authType?.login_type === LoginType.sms) {
      navigation.navigate(ProfileScreens.SMS_LOGIN);
    }
    if (authType?.login_type === LoginType.client_call) {
      navigation.navigate(ProfileScreens.PHONE_CALL_LOGIN);
    }
  }, [authType, navigation]);

  const isNumberExist = useCallback(
    () => confirmedAccounts.map(ac => ac.phone).includes(rawUserNumberForLogin),
    [confirmedAccounts, rawUserNumberForLogin]
  );

  const isButtonDisabled = useCallback(() => {
    return userNumberForLogin.length !== numberLength + nonNumericCount || isNumberExist();
  }, [numberLength, nonNumericCount, isNumberExist, userNumberForLogin.length]);

  useEffect(() => {
    if (!isloadingCreateCoupledToken && currentCity) {
      setTimeout(() => phoneInput.current?.focus(), 100);
    }
  }, [isloadingCreateCoupledToken, currentCity]);

  if (isloadingCreateCoupledToken) {
    return <LoadingIndicator />;
  }

  return (
    <View style={s.container}>
      <View style={s.flexContainer}>
        <MyAppText style={s.descr}>Введите номер телефона</MyAppText>
        <View style={s.phoneContainer}>
          <MyAppText style={s.phonePrefix}>{`+${authType?.phones_login_info.phone_start}`}</MyAppText>
          {isNumberExist() && <MyAppText style={s.numberIsExistText}>Номер уже существует</MyAppText>}
          <TextInput
            ref={phoneInput}
            keyboardType="numeric"
            onChangeText={handleOnChangeText}
            value={userNumberForLogin}
            style={[s.phoneInput, isNumberExist() && s.numberIsExist]}
            maxLength={numberLength + nonNumericCount}
            placeholder="Номер телефона"
          />
        </View>
        <TouchableOpacity
          disabled={isButtonDisabled()}
          style={[s.enterButton, isButtonDisabled() && s.disabledButton]}
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
  phoneContainer: {
    borderWidth: 1,
    borderColor: "#E7E7E7",
    marginTop: 30,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#F3EDED",
  },
  phonePrefix: {
    fontSize: 16,
    fontFamily: FontFamily.MEDIUM,
    fontWeight: "500",
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
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  numberIsExist: { borderColor: "#f5938c" },
  numberIsExistText: {
    position: "absolute",
    fontSize: 16,
    fontWeight: "600",
    bottom: -20,
    left: 50,
    color: "#f5938c",
  },
  enterButton: { padding: 15, backgroundColor: "#383F85", borderRadius: 10, marginTop: 40 },
  disabledButton: { opacity: 0.5 },
  enterText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
});
