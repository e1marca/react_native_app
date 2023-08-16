import { makeAutoObservable } from "mobx";
import { MobileToken } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiConfig, instance } from "configs/apiConfig";
import RootStore from "../rootStore";
import { authService } from "./service";

export class AuthStore {
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);
  }

  public mobileToken: MobileToken = {} as MobileToken;
  public userNumberForLogin = "";
  public numberForPhoneCall = "";
  public isSmsCodeInvalid = false;

  public readonly setNumberForPhoneCall = (value: string) => {
    this.numberForPhoneCall = value;
  };
  public readonly setSmsCodeInvalidity = (value: boolean) => {
    this.isSmsCodeInvalid = value;
  };
  public get userFullName() {
    return this.mobileToken.client_info.fio;
  }
  public get isAuthenticated() {
    return this.mobileToken && this.mobileToken.client_info
      ? !!Object.keys(this.mobileToken.client_info).length
      : false;
  }

  public get confirmedAccounts() {
    return this.mobileToken.coupled_mobile_tokens.filter(mt => !!Object.keys(mt.client_info).length);
  }

  public readonly setMobileToken = (value: MobileToken) => {
    this.mobileToken = value;
    this.rootStore.cartStore.setCart(value.cart);
  };

  public readonly setUserNumberForLogin = (value: string) => {
    this.userNumberForLogin = value;
  };

  public get rawUserNumberForLogin() {
    return this.authType?.phones_login_info.phone_start + this.userNumberForLogin.replace(/\D/g, "");
  }

  public get userNumberForLoginWithPrefix() {
    return this.authType?.phones_login_info.phone_start + this.userNumberForLogin;
  }

  public get authType() {
    return this.mobileToken.company_info.auth_type;
  }

  public get mobileDeliveryType() {
    return this.mobileToken.company_info.mobile_delivery_type;
  }

  public get pickupPoints() {
    return this.mobileToken.company_info.pickup_points;
  }

  public get deliveryZones() {
    return this.mobileToken.districts.map(d => d.zones);
  }
  public get currentCity() {
    return this.mobileToken.city_branch?.title;
  }
  public get currentOrder() {
    return this.mobileToken.current_order;
  }
  public readonly getOrUpdateToken = async () => {
    console.log("getOrUpdateToken");
    const token = await AsyncStorage.getItem("mobile-token");
    const { mobile_token } = await authService.getOrUpdateToken(token || null);
    await AsyncStorage.setItem(ApiConfig.mobileToken, mobile_token.token);
    instance.defaults.headers.common[ApiConfig.mobileToken] = mobile_token.token;
    this.setMobileToken(mobile_token);
    console.log("getOrUpdateToken", mobile_token.client_info.cards);
  };

  public readonly switchAccount = async (token: string) => {
    console.log("switchAccount");
    await AsyncStorage.setItem(ApiConfig.mobileToken, token);
    await this.getOrUpdateToken();
  };

  public sendSmsCode = async () => {
    console.log("sendSmsCode");
    try {
      const response = await authService.sendSmsCode(this.rawUserNumberForLogin);
      console.log("sendSmsCode", response);
    } catch (error) {
      console.log(error);
    }
  };

  public submitSmsCode = async (code: string) => {
    console.log("submitSmsCode");
    try {
      const response = await authService.submitSmsCode(code);
      console.log("submitSmsCode", response);
      this.setMobileToken(response.mobile_token);
      this.rootStore.catalogStore.getCatalog();
    } catch (error) {
      console.log(error);
      this.setSmsCodeInvalidity(true);
    }
  };

  public loginByPhoneCall = async () => {
    console.log("loginByPhoneCall");
    console.log(this.rawUserNumberForLogin);
    const response = await authService.loginByPhoneCall(this.rawUserNumberForLogin);
    console.log("loginByPhoneCall", response.data);

    this.setNumberForPhoneCall(response.data.phone);
  };

  public readonly createCoupledToken = async () => {
    console.log("loginByPhoneCall");
    const response = await authService.createCoupledToken();
    await AsyncStorage.setItem(ApiConfig.mobileToken, response.mobile_token.token);
    await this.getOrUpdateToken();
    await this.rootStore.catalogStore.getCatalog();

    console.log("createCoupledToken", response);
  };

  public readonly setCity = async (city_brach_id: string) => {
    console.log("setCity");
    try {
      const response = await authService.setCity(city_brach_id);
      this.setMobileToken(response.mobile_token);
      await this.rootStore.catalogStore.getCatalog();
      console.log(response);
    } catch (error) {
      console.error("error while setting city", error);
    }
  };

  public logout = async () => {
    console.log("logout");
    const response = await authService.logout();
    console.log(3232323, response);
    await AsyncStorage.setItem(ApiConfig.mobileToken, response.mobile_token.token);
    this.setUserNumberForLogin("");
    console.log("logout", response);
    await this.getOrUpdateToken();
    await this.rootStore.catalogStore.getCatalog();
  };
}
