import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { EmptyScreen } from "src/shared/Widgets/EmptyScreen";

export const NoCards: FC = () => {
  const { t } = useTranslation();

  return (
    <EmptyScreen title={t("Profile:NoCards") as string} imageSource={require("icons/profileScreen/noCards.png")} />
  );
};
