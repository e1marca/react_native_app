import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { EmptyScreen } from "src/shared/Widgets/EmptyScreen";
import { AppScreen, AppStackParamList } from "src/screens/types";

type NavigationProp = StackNavigationProp<AppStackParamList>;
const { Catalog } = AppScreen;

export const NoOrders: FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation<NavigationProp>();
  const handleNavigate = () => {
    navigate(Catalog);
  };

  return (
    <EmptyScreen
      title={t("Profile:NoOrders") as string}
      imageSource={require("icons/profileScreen/noOrders.png")}
      handleNavigate={handleNavigate}
      buttonText={t("General:GoToCatalog") as string}
    />
  );
};
