import { makeAutoObservable } from "mobx";
import RootStore from "../rootStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainStoreAsyncKeys } from "./types";

export class MainStore {
  public isGreetingScreenShown = false;
  public redirectScreen: any | null = null;

  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);
  }

  public updateGreetingScreenShown = (value: boolean) => {
    this.isGreetingScreenShown = value;
  };

  public setRedirectScreen = (screen: any | null) => {
    console.log("setRedirectScreen", screen);
    this.redirectScreen = screen;
  };

  public initialize = async () => {
    try {
      const value = await AsyncStorage.getItem(MainStoreAsyncKeys.isGreetingScreenShown);
      if (value !== null && value === "true") {
        this.updateGreetingScreenShown(true);
      }
    } catch (error) {
      console.error("Error retrieving isGreetingScreenShown value:", error);
    }
  };

  public readonly setGreetingScreenShown = async () => {
    try {
      await AsyncStorage.setItem(MainStoreAsyncKeys.isGreetingScreenShown, "true");
      this.updateGreetingScreenShown(true);
    } catch (error) {
      console.error("Error setting isGreetingScreenShown value:", error);
    }
  };
}
