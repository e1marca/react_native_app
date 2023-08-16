import { CommonActions, useNavigation } from "@react-navigation/core";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFetch } from "src/hooks/useFetch";
import { useRootStore } from "src/hooks/useRootStore";
import { AppScreen } from "src/screens/types";
import { BottomModalWrapper } from "src/shared/Modals/BottomModalWrapper";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { RadioButton } from "src/shared/Widgets/RadioButton";

export const CitySelector: React.FC = observer(() => {
  const {
    authStore: {
      currentCity,
      setCity,
      mobileToken: {
        company_info: { city_branches, mobile_auth_required },
      },
      isAuthenticated,
    },
  } = useRootStore();
  const { invokeApi: invokeSetCity, isLoading: isLoadingSetCity } = useFetch(setCity);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const NAVIGATION_BLOCKED = !isAuthenticated && mobile_auth_required;

  const handleSetCity = async (id: string) => {
    await invokeSetCity(id);
    setModalVisible(false);

    if (!NAVIGATION_BLOCKED) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: AppScreen.Main }],
        })
      );
    }
  };

  return (
    <View>
      <TouchableOpacity activeOpacity={0.5} onPress={() => setModalVisible(true)} style={s.citySelectorTouch}>
        <View style={s.citySelectorView}>
          <MyIcon styles={s.cityIcon} source={require("icons/profileScreen/place.png")} />
          <MyAppText style={s.cityTextInline}>{currentCity || "Не выбран"}</MyAppText>
        </View>
        <MyAppText style={s.changeCityText}>Сменить город</MyAppText>
      </TouchableOpacity>
      <BottomModalWrapper visible={isModalVisible} setVisible={setModalVisible}>
        <View style={s.modalWrapper}>
          <MyAppText style={s.modalHeader}>Выберите город</MyAppText>
          <View style={{ height: city_branches.length * 35, maxHeight: 5 * 35 }}>
            {isLoadingSetCity && (
              <View style={s.loadingIndicatorWrapper}>
                <LoadingIndicator />
              </View>
            )}
            <FlatList
              data={city_branches}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={s.cityListTouch} onPress={() => handleSetCity(item.id)}>
                  <RadioButton isSelected={currentCity === item.title} />
                  <MyAppText style={s.cityText}>{item.title}</MyAppText>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </BottomModalWrapper>
    </View>
  );
});

const s = StyleSheet.create({
  citySelectorTouch: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: "#D6D6D6",
  },
  citySelectorView: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityIcon: {
    tintColor: "#10BBFF",
  },
  cityTextInline: {
    color: "#10BBFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FontFamily.BOLD,
    marginLeft: 5,
  },
  changeCityText: {
    fontFamily: FontFamily.BOLD,
    fontWeight: "600",
    color: "#3A3A3A",
    fontSize: 16,
  },
  modalWrapper: {
    padding: 20,
  },
  menuItemText: {
    fontWeight: "400",
    fontSize: 18,
    color: "#555555",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#404040",
    marginBottom: 15,
  },
  cityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#505050",
  },
  cityListTouch: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  loadingIndicatorWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
