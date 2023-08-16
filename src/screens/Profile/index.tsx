import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ProfileScreens } from "./types";
import { AutoOrders } from "./AutoOrders";
import { Header } from "src/shared/Widgets/Header";
import { Bonuses } from "./Bonuses";
import { Cards } from "./Cards";
import { Orders } from "./Orders";
import { HomeScreen } from "./HomeScreen";
import { Places } from "./Places";
import { useTranslation } from "react-i18next";
import { PhoneAuth } from "./PhoneAuth";
import { SmsLogin } from "./SmsLogin";
import { PhoneCallLogin } from "./PhoneCallLogin";
import { AddAddress } from "./Places/AddAddress";
import { EditAddress } from "./Places/EditAddress";
import { SignUpScreen } from "./SignUpScreen";
import { observer } from "mobx-react-lite";
import { AddAccount } from "./AddAccount";
import { ChatWithManager } from "./ChatWithManager";

const Stack = createStackNavigator();
const {
  PROFILE_HOME,
  AUTO_ORDERS,
  BONUSES,
  CARDS,
  ORDERS,
  PLACES,
  PHONE_AUTH,
  SMS_LOGIN,
  PHONE_CALL_LOGIN,
  ADD_ACCOUNT,
  ADD_ADDRESS,
  EDIT_ADDRESS,
  SIGN_UP,
  CHAT_WITH_MANAGER,
} = ProfileScreens;

const screens = {
  [PROFILE_HOME]: HomeScreen,
  [AUTO_ORDERS]: AutoOrders,
  [BONUSES]: Bonuses,
  [CARDS]: Cards,
  [ORDERS]: Orders,
  [PLACES]: Places,
  [PHONE_AUTH]: PhoneAuth,
  [SMS_LOGIN]: SmsLogin,
  [PHONE_CALL_LOGIN]: PhoneCallLogin,
  [ADD_ADDRESS]: AddAddress,
  [EDIT_ADDRESS]: EditAddress,
  [SIGN_UP]: SignUpScreen,
  [ADD_ACCOUNT]: AddAccount,
  [CHAT_WITH_MANAGER]: ChatWithManager,
};

export const ProfileScreen = observer(() => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName={PROFILE_HOME}>
      {Object.entries(screens).map(([name, component]) => (
        <Stack.Screen
          key={name}
          name={name}
          component={component}
          options={{
            header: () => <Header hideBackButton={name === PROFILE_HOME} title={t(`Profile:${name}`) as string} />,
          }}
        />
      ))}
    </Stack.Navigator>
  );
});
