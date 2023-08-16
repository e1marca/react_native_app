import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Linking, AppState, TouchableOpacity, View, StyleSheet, AppStateStatus } from "react-native";
import { useFetch } from "src/hooks/useFetch";
import { useRootStore } from "src/hooks/useRootStore";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { Footer } from "../Footer";
import { useNavigation } from "@react-navigation/core";
import { ProfileScreens, ProfileStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { MyIcon } from "src/shared/Widgets/MyIcon";

export const PhoneCallLogin = observer(() => {
  const {
    authStore: { mobileToken, loginByPhoneCall, getOrUpdateToken, numberForPhoneCall },
    catalogStore: { getCatalog },
  } = useRootStore();
  const {
    invokeApi: invokeLoginByPhoneCall,
    isLoading: isLoginByPhoneCallLoading,
    isSuccess: isLoginByPhoneCallSuccess,
  } = useFetch(loginByPhoneCall);

  const { invokeApi: invokeUpdateToken, isLoading: isLoadingUpdateToken } = useFetch(getOrUpdateToken);
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();

  useEffect(() => {
    if (mobileToken && Object.values(mobileToken.client_info).length) {
      navigation.navigate(ProfileScreens.PROFILE_HOME);
    }
  }, [mobileToken, navigation]);

  useEffect(() => {
    invokeLoginByPhoneCall();

    const subscription = AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      invokeUpdateToken();
      getCatalog();
    }
  };

  const initialTime = 5 * 60;
  const [timer, setTimer] = useState(initialTime);

  useEffect(() => {
    if (isLoginByPhoneCallSuccess) {
      const interval = setInterval(() => {
        setTimer(timer => {
          if (timer <= 0) {
            invokeUpdateToken();
            return initialTime;
          } else {
            return timer - 1;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLoginByPhoneCallSuccess, invokeUpdateToken]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const cleanedNumber = numberForPhoneCall.replace(/\D/g, "");
  const formattedNumber =
    "+7 (" +
    cleanedNumber.substring(1, 4) +
    ") " +
    cleanedNumber.substring(4, 7) +
    " " +
    cleanedNumber.substring(7, 9) +
    "-" +
    cleanedNumber.substring(9, 11);

  if (isLoginByPhoneCallLoading || isLoadingUpdateToken) {
    return <LoadingIndicator />;
  }

  return (
    <View style={s.container}>
      <View style={s.contentContainer}>
        <TouchableOpacity
          style={s.callButton}
          onPress={() => {
            Linking.openURL(`tel:${numberForPhoneCall}`);
          }}>
          <MyIcon source={require("icons/profileScreen/call.png")} />
          <MyAppText style={s.callButtonText}>{formattedNumber}</MyAppText>
        </TouchableOpacity>
        <MyAppText style={s.infoText}>Ожидается звонок в течение</MyAppText>
        {isLoginByPhoneCallSuccess && (
          <View style={s.countdownContainer}>
            <MyAppText style={s.countdownText}>{`${minutes} : ${seconds < 10 ? "0" + seconds : seconds}`}</MyAppText>
          </View>
        )}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MyAppText style={s.cancelText}>Отменить</MyAppText>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
});

const s = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  contentContainer: { flex: 2, justifyContent: "center" },
  callButton: {
    backgroundColor: "#383F85",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    margin: 30,
  },
  callButtonText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: FontFamily.SEMIBOLD,
    color: "#F7F7F7",
    textAlign: "center",
    marginLeft: 10,
    letterSpacing: 1,
    textAlignVertical: "center",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: FontFamily.REGULAR,
    color: "#3D4250",
    textAlign: "center",
    marginLeft: 10,
  },
  countdownContainer: {
    marginTop: 20,
    backgroundColor: "#DEDEDE",
    padding: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    borderRadius: 10,
  },
  countdownText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FontFamily.SEMIBOLD,
    color: "#3D4250",
    textAlign: "center",
  },
  cancelText: {
    fontWeight: "400",
    fontSize: 16,
    textAlign: "center",
    color: "#000",
    opacity: 0.5,
    fontFamily: FontFamily.SEMIBOLD,
    marginTop: 20,
  },
});
