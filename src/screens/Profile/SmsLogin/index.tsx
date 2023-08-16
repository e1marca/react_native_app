import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useFetch } from "src/hooks/useFetch";
import { useRootStore } from "src/hooks/useRootStore";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { Input } from "./Input";
import { Footer } from "../Footer";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileScreens, ProfileStackParamList } from "../types";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";

export const SmsLogin = observer(() => {
  const {
    authStore: { submitSmsCode, mobileToken, sendSmsCode, isAuthenticated },
  } = useRootStore();
  const { invokeApi: invokeSubmitSmsCode, isLoading: isLoadingSubmitSmsCode } = useFetch(submitSmsCode);
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();

  const { invokeApi: invokeSendSmsCode, isLoading: isSmsCodeSending } = useFetch(sendSmsCode);

  useEffect(() => {
    invokeSendSmsCode();
  }, [invokeSendSmsCode]);

  useEffect(() => {
    if (mobileToken && isAuthenticated) {
      navigation.navigate(ProfileScreens.PROFILE_HOME);
    }
  }, [mobileToken, navigation, isAuthenticated]);

  useEffect(() => {
    const codeForSend = [...code].join("");
    if (codeForSend.length === 4) {
      invokeSubmitSmsCode(code.join(""));
    }
  }, [code, invokeSubmitSmsCode]);

  const handleConfirmButton = () => {
    invokeSubmitSmsCode([...code].join(""));
  };

  const disableConfirmButton = () => code.some(cell => cell === "");

  return (
    <View style={styles.container}>
      {(isLoadingSubmitSmsCode || isSmsCodeSending) && (
        <View style={styles.loadingIndicatorWrapper}>
          <LoadingIndicator />
        </View>
      )}
      <View style={styles.innerContainer}>
        <MyAppText style={styles.text}>Введите код из смс</MyAppText>
        <Input code={code} setCode={setCode} />
        <TouchableOpacity
          style={[styles.button, disableConfirmButton() && styles.disabledButton]}
          onPress={handleConfirmButton}
          disabled={disableConfirmButton()}>
          <MyAppText style={styles.buttonText}>Подтвердить</MyAppText>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
});

const styles = StyleSheet.create({
  loadingIndicatorWrapper: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.1)",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  innerContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#3D4250",
    fontWeight: "400",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#383F85",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  disabledButton: { opacity: 0.5 },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F7F7F7",
    padding: 15,
    borderRadius: 10,
    fontFamily: FontFamily.SEMIBOLD,
  },
});
