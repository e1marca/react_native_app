import { instance } from "configs/apiConfig";
import { Catalog, CategoryItem, GetCatalogParams, ProductDetailsServerResponse } from "./types";

export const catalogService = {
  getCatalog: async ({ categoryId, q }: GetCatalogParams = {}): Promise<Catalog> => {
    const response = await instance.post<Catalog>("/v3/catalog", {
      category_id: categoryId ?? "",
      q: q ?? "",
    });
    return response.data;
  },

  getProductDetails: async (id: string): Promise<CategoryItem> => {
    const response = await instance.get<ProductDetailsServerResponse>(`/v3/catalog/items/${id}`);
    return response.data.item;
  },
};
