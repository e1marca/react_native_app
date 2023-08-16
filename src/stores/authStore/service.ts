import { MobileTokenServerResponse } from "./types";
import { instance } from "configs/apiConfig";

export const authService = {
  getOrUpdateToken: async (token: string | null): Promise<MobileTokenServerResponse> => {
    const requestBody = token ? { token } : {};
    const response = await instance.post<MobileTokenServerResponse>("v3/tokens", requestBody);

    return response.data;
  },
  updateCityInToken: async (token: string, cityId: string) => {
    const response = await instance.post("/v3/tokens/city", {
      token,
      city_id: cityId,
    });
    return response.data;
  },
  sendSmsCode: async (phone: string) => {
    const response = await instance.post("/v3/tokens/send_code", {
      phone,
    });
    return response;
  },
  submitSmsCode: async (code: string) => {
    const response = await instance.post("/v3/tokens/submit_code", {
      code,
    });
    return response.data;
  },
  loginByPhoneCall: async (phone: string) => {
    const response = await instance.post<{ phone: string }>("/v3/tokens/submit_phone", {
      phone,
    });
    return response;
  },
  createCoupledToken: async (): Promise<MobileTokenServerResponse> => {
    const response = await instance.post<MobileTokenServerResponse>("/v3/tokens/create_coupled");
    return response.data;
  },
  setCity: async (city_brach_id: string): Promise<MobileTokenServerResponse> => {
    const response = await instance.post<MobileTokenServerResponse>("/v3/tokens/city", {
      city_id: city_brach_id,
    });
    return response.data;
  },
  logout: async (): Promise<MobileTokenServerResponse> => {
    const response = await instance.delete<MobileTokenServerResponse>("/v3/tokens/logout");
    return response.data;
  },
};
