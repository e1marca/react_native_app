import { observer } from "mobx-react-lite";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRootStore } from "src/hooks/useRootStore";
import { EmptyScreen } from "src/shared/Widgets/EmptyScreen";

export const NoProducts: FC = observer(() => {
  const {
    catalogStore: { generalProducts, userSearchResults },
  } = useRootStore();
  const { t } = useTranslation();

  const getTitle = useCallback(() => {
    return userSearchResults
      ? t("General:NoSearchResults")
      : !generalProducts?.length
      ? t("Catalog:NoProducts")
      : t("Catalog:NoProductsInCategory");
  }, [generalProducts, userSearchResults, t]);

  return <EmptyScreen title={getTitle()} imageSource={require("icons/catalogScreen/noProducts.png")} />;
});
