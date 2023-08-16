export enum ProfileScreens {
  PROFILE_HOME = "PROFILE_HOME",
  AUTO_ORDERS = "AUTO_ORDERS",
  CARDS = "CARDS",
  ORDERS = "ORDERS",
  BONUSES = "BONUSES",
  PLACES = "PLACES",
  PHONE_AUTH = "PHONE_AUTH",
  SMS_LOGIN = "SMS_LOGIN",
  PHONE_CALL_LOGIN = "PHONE_CALL_LOGIN",
  ADD_ADDRESS = "ADD_ADDRESS",
  EDIT_ADDRESS = "EDIT_ADDRESS",
  SIGN_UP = "SIGN_UP",
  ADD_ACCOUNT = "ADD_ACCOUNT",
  CHAT_WITH_MANAGER = "CHAT_WITH_MANAGER",
}

export type ProfileStackParamList = {
  [ProfileScreens.PROFILE_HOME]: undefined;
  [ProfileScreens.AUTO_ORDERS]: undefined;
  [ProfileScreens.CARDS]: undefined;
  [ProfileScreens.ORDERS]: undefined;
  [ProfileScreens.BONUSES]: undefined;
  [ProfileScreens.PLACES]: undefined;
  [ProfileScreens.PHONE_AUTH]: undefined;
  [ProfileScreens.SMS_LOGIN]: undefined;
  [ProfileScreens.PHONE_CALL_LOGIN]: undefined;
  [ProfileScreens.ADD_ADDRESS]: undefined;
  [ProfileScreens.EDIT_ADDRESS]: { id: string };
  [ProfileScreens.SIGN_UP]: undefined;
  [ProfileScreens.ADD_ACCOUNT]: undefined;
  [ProfileScreens.CHAT_WITH_MANAGER]: undefined;
};
