import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useFetch } from "src/hooks/useFetch";
import { RouteProp, useRoute } from "@react-navigation/core";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { ProductList } from "../ProductList";
import { ErrorMessage } from "src/shared/Widgets/ErrorMessage";
import { CatalogScreens, CatalogStackParamList } from "../types";
import { useRootStore } from "src/hooks/useRootStore";

const { CATEGORY_SCREEN } = CatalogScreens;

export const CategoryScreen = observer(() => {
  const { catalogStore } = useRootStore();
  const { getCategoryItems, resetCategoryandItems, categoryItems } = catalogStore;
  const {
    params: { categoryId },
  } = useRoute<RouteProp<CatalogStackParamList, typeof CATEGORY_SCREEN>>();

  const { invokeApi, isLoading } = useFetch(getCategoryItems);
  const onRefresh = () => {
    invokeApi(categoryId);
  };

  useEffect(() => {
    invokeApi(categoryId);
    return () => resetCategoryandItems();
  }, [invokeApi, categoryId, resetCategoryandItems]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!categoryItems) {
    return <ErrorMessage />;
  }

  return <ProductList products={categoryItems} onRefresh={onRefresh} isLoading={isLoading} />;
});
