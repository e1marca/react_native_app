import { instance } from "configs/apiConfig";
import {
  ReversGeocodeResponse,
  ProcessedAddress,
  InputAddress,
  Location,
  UpdateAddressResponse,
  GetAddressesResponse,
} from "./types";

export const AddressService = {
  getAddresses: async (): Promise<ProcessedAddress[]> => {
    const response = await instance.get<GetAddressesResponse>("/v3/addresses");
    return response.data.addresses;
  },
  reverseGeocode: async ({ lat, lng }: Location): Promise<ReversGeocodeResponse> => {
    const response = await instance.post<ReversGeocodeResponse>("/v3/addresses/reverse_geocode", {
      lat,
      lng,
    });
    return response.data;
  },
  getDistrict: async (lat: number, lng: number): Promise<string | null> => {
    const response = await instance.post<{ district_id: string }>("/v3/addresses/district", {
      lat,
      lng,
    });
    return response.data.district_id;
  },
  createAddress: async (addressData: InputAddress): Promise<ProcessedAddress> => {
    try {
      const response = await instance.post<UpdateAddressResponse>("/v3/addresses", { address: addressData });
      return response.data.address;
    } catch (error) {
      console.log("An error occurred while updating the address:", error);
      throw error;
    }
  },
  deleteAddress: async (id: string): Promise<ProcessedAddress[]> => {
    const response = await instance.delete<GetAddressesResponse>(`/v3/addresses/${id}`);
    return response.data.addresses;
  },

  updateAddress: async (id: string, address: Partial<InputAddress>): Promise<ProcessedAddress> => {
    const response = await instance.put<UpdateAddressResponse>(`/v3/addresses/${id}`, { address });
    return response.data.address;
  },
};
