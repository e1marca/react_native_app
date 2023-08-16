import { observer } from "mobx-react-lite";
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { CitySelector } from "../../CitySelector";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileScreens } from "../../types";
import { AppScreen, AppStackParamList } from "src/screens/types";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { useRootStore } from "src/hooks/useRootStore";

interface InteractiveAssistantProps {
  handleLogout: () => void;
}

const MenuItem: React.FC<{ text: string; icon?: any; screen?: ProfileScreens }> = ({ text, icon, screen }) => {
  const { navigate } = useNavigation<StackNavigationProp<AppStackParamList>>();

  const handleNavigate = () => {
    screen && navigate(AppScreen.Profile, { screen });
  };
  return (
    <TouchableOpacity style={s.menuItem} onPress={handleNavigate}>
      {icon && <MyIcon styles={s.menuItemImage} source={icon} />}
      <MyAppText style={s.menuItemText}>{text}</MyAppText>
    </TouchableOpacity>
  );
};

export const InteractiveAssistant: React.FC<InteractiveAssistantProps> = observer(({ handleLogout }) => {
  const {
    authStore: {
      mobileToken: {
        company_info: { mobile_chat_enabled },
      },
    },
  } = useRootStore();
  
  const { CHAT_WITH_MANAGER } = ProfileScreens;

  return (
    <View style={s.container}>
      <CitySelector />
      {mobile_chat_enabled && <MenuItem text="Чат с менеджером" screen={CHAT_WITH_MANAGER} />}
      <MenuItem text="Позвонить" />
      <MenuItem text="Информация" />
      <MenuItem text="Настройки" />
      <TouchableOpacity style={s.menuItem} onPress={handleLogout}>
        <MyIcon styles={s.menuItemImage} source={require("icons/profileScreen/exit.png")} />
        <MyAppText style={s.menuItemText}>Выйти</MyAppText>
      </TouchableOpacity>
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: 10,
    borderRadius: 10,
  },
  menuItem: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontWeight: "400",
    fontSize: 18,
    color: "#555555",
    fontFamily: FontFamily.MEDIUM,
  },
  menuItemImage: {
    marginRight: 5,
    width: 18,
    height: 18,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#404040",
    marginBottom: 15,
  },
  cityText: { fontSize: 16, fontWeight: "600", color: "#505050" },
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
