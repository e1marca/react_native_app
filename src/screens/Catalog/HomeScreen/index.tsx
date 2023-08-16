import React from "react";
import { observer } from "mobx-react-lite";
import { Catalog } from "src/shared/Catalog";

interface CatalogProps {
  header?: React.ReactElement;
}

export const HomeScreen = observer(({ header }: CatalogProps) => {
  return <Catalog header={header} />;
});
