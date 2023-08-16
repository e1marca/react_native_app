import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { ErrorMessage } from "src/shared/Widgets/ErrorMessage";
import { useFetch } from "src/hooks/useFetch";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { CategoriesGridScreen } from "./CategoriesGridScreen";
import { useRootStore } from "src/hooks/useRootStore";
import { withUserSearchResults } from "src/hoc/WithUserSearchResults";

interface CatalogProps {
  header?: React.ReactElement;
}

export const Catalog = observer(({ header }: CatalogProps) => {
  const { catalogStore } = useRootStore();
  const { getCatalog, generalProducts, categories } = catalogStore;
  const { invokeApi, isLoading } = useFetch(getCatalog);

  useEffect(() => {
    invokeApi();
  }, [invokeApi]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!categories || !generalProducts) {
    return <ErrorMessage />;
  }

  const WithUserSearchResults = withUserSearchResults(CategoriesGridScreen);

  return <WithUserSearchResults categories={categories} generalProducts={generalProducts} Header={header} />;
});
