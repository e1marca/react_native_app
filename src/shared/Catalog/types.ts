export enum CatalogScreens {
  CATALOG_SCREEN = "CATALOG_SCREEN",
  CATEGORY_SCREEN = "CATEGORY_SCREEN",
  PRODUCT_DETAIL_SCREEN = "PRODUCT_DETAIL_SCREEN",
}

const { CATALOG_SCREEN, PRODUCT_DETAIL_SCREEN, CATEGORY_SCREEN } = CatalogScreens;

export type CatalogStackParamList = {
  [CATALOG_SCREEN]: undefined;
  [CATEGORY_SCREEN]: { categoryId: string };
  [PRODUCT_DETAIL_SCREEN]: { itemId: string };
};
