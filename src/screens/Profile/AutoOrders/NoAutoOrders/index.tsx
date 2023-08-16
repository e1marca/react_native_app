import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { EmptyScreen } from "src/shared/Widgets/EmptyScreen";
import { ProfileScreens, ProfileStackParamList } from "../../types";

type NavigationProp = StackNavigationProp<ProfileStackParamList>;
const { ORDERS } = ProfileScreens;

export const NoAutoOrders: FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation<NavigationProp>();
  const handleNavigate = () => {
    navigate(ORDERS);
  };

  return (
    <EmptyScreen
      title={t("Profile:NoAutoOrders") as string}
      imageSource={require("icons/profileScreen/noAutoOrders.png")}
      handleNavigate={handleNavigate}
      buttonText={t("Profile:GoToOrders") as string}
    />
  );
};
