import { makeAutoObservable } from "mobx";
import { Catalog, Category, CategoryItem } from "./types";
import { catalogService } from "./service";
import RootStore from "../rootStore";

export class CatalogStore {
  public catalog: Catalog | null = null;
  public categoryItems: CategoryItem[] | null = null;
  public productDetails: CategoryItem | null = null;
  public category: Category | null = null;
  public userSearchResults: CategoryItem[] | null = null;
  public userSearchResultsIsLoading: boolean = false;

  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);
  }
  public readonly setUserSearchResults = (value: CategoryItem[] | null): void => {
    this.userSearchResults = value;
  };

  public readonly setCategory = (value: Category | null): void => {
    this.category = value;
  };

  public readonly setCatalog = (value: Catalog): void => {
    this.catalog = value;
  };

  public readonly setCategoryItems = (value: CategoryItem[]): void => {
    this.categoryItems = value;
  };

  public readonly resetCategoryandItems = (): void => {
    this.categoryItems = null;
    this.category = null;
  };

  public readonly setProductDetails = (value: CategoryItem): void => {
    this.productDetails = value;
  };
  public readonly setUserSearchResultsIsLoading = (value: boolean): void => {
    this.userSearchResultsIsLoading = value;
  };

  public get categories(): Category[] | null {
    if (this.catalog) {
      return this.catalog.categories;
    } else {
      return null;
    }
  }
  public get generalProducts(): CategoryItem[] | null {
    if (this.catalog) {
      return this.catalog.items;
    } else {
      return null;
    }
  }

  public readonly getCatalog = async () => {
    console.log("getCatalog");
    try {
      const response = await catalogService.getCatalog();
      this.setCatalog(response);
      console.log("getCatalog", response);
    } catch (error) {
      console.error("getCatalog", error);
    }
  };

  public readonly getCategoryItems = async (categoryId: string, q?: string) => {
    const response = await catalogService.getCatalog({ categoryId, q });
    this.setCategoryItems(response.items);
    this.setCategory(response.category);
    console.log("getCategoryItems", response.items);
  };

  public readonly getProductDetails = async (itemId: string) => {
    const response = await catalogService.getProductDetails(itemId);
    this.setProductDetails(response);
    console.log("getProductDetails", response);
  };
  public readonly getUserSearchResults = async (q: string) => {
    const response = await catalogService.getCatalog({ q });
    this.setUserSearchResults(response.items);
    console.log("getUserSearchResults", response);
  };
}
