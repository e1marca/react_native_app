import { CatalogScreens, CatalogStackParamList } from "src/shared/Catalog/types";
import { MainScreens, MainScreenStackParamList } from "./Main/types";
import { ProfileScreens, ProfileStackParamList } from "./Profile/types";
import { CartScreens, CartStackParamList } from "./Cart/types";

export enum AppScreen {
  Main = "Main",
  Catalog = "Catalog",
  Cart = "Cart",
  Profile = "Profile",
}

export type AppStackParamList = {
  [AppScreen.Main]:
    | { screen: MainScreens; params?: MainScreenStackParamList[keyof MainScreenStackParamList] }
    | undefined;
  [AppScreen.Catalog]:
    | { screen: CatalogScreens; params?: CatalogStackParamList[keyof CatalogStackParamList] }
    | undefined;
  [AppScreen.Cart]: { screen: CartScreens; params?: CartStackParamList[keyof CartStackParamList] } | undefined;
  [AppScreen.Profile]:
    | { screen: ProfileScreens; params?: ProfileStackParamList[keyof ProfileStackParamList] }
    | undefined;
};
