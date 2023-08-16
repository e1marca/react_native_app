import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavigationStackProp } from "react-navigation-stack";
import { EmptyScreen } from "src/shared/Widgets/EmptyScreen";
import { ProfileScreens, ProfileStackParamList } from "../../types";
import { useNavigation } from "@react-navigation/core";

export const NoPlaces: FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation<NavigationStackProp<ProfileStackParamList>>();
  const handleNavigate = () => {
    navigate(ProfileScreens.ADD_ADDRESS);
  };

  return (
    <EmptyScreen
      title={t("Profile:NoPlaces") as string}
      imageSource={require("icons/profileScreen/noPlaces.png")}
      handleNavigate={handleNavigate}
      buttonText={t("Profile:ADD_ADDRESS") as string}
    />
  );
};
