import { makeAutoObservable } from "mobx";
import { AddressService } from "./service";
import RootStore from "../rootStore";
import { InputAddress, Location, ProcessedAddress } from "./types";

export class AddressStore {
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);
  }
  public initialInputAddress: InputAddress = {
    city: "",
    street: "",
    dom: "",
    kv: "",
    entrance: "",
    floor: "",
    korp: "",
    client_comment: "",
    location: {
      lat: null,
      lng: null,
    },
  };

  public inputAddress: InputAddress = { ...this.initialInputAddress };
  public district_id: string | null = null;
  public addresses: ProcessedAddress[] | null = null;

  public setAddresses = (value: ProcessedAddress[]) => {
    this.addresses = value;
  };
  public setDistrictId = (id: string) => {
    this.district_id = id;
  };

  public resetDistrictId = () => {
    this.district_id = null;
  };

  public resetInputAddress = () => {
    this.inputAddress = { ...this.initialInputAddress };
  };

  public setInputAddress = (value: Partial<InputAddress>) => {
    this.inputAddress = { ...this.inputAddress, ...value };
  };

  public get deliveryAvailable() {
    return !!this.district_id;
  }

  public readonly getAddresses = async () => {
    const response = await AddressService.getAddresses();
    this.setAddresses(response);
    console.log("getAddresses", response);
  };

  public readonly reverseGeocode = async ({ lat, lng }: Location) => {
    const response = await AddressService.reverseGeocode({ lat, lng });
    const { address, district_id } = response;
    console.log(response);
    this.resetDistrictId();
    this.resetInputAddress();
    if (district_id && address.dom && address.city) {
      this.setDistrictId(district_id);
      this.setInputAddress({ ...address, location: { lat, lng } });
    }
  };

  public readonly getDistrict = async (lat: number, lng: number) => {
    const response = await AddressService.getDistrict(lat, lng);
    console.log(response);
  };

  // public readonly geocode = async (addressData: GeocodeRequest) => {
  //   const response = await AddressService.geocode(addressData);
  //   this.setInputAddress(response);
  // };

  public readonly createAddress = async (addressData: InputAddress) => {
    const response = await AddressService.createAddress(addressData);
    this.resetDistrictId();
    this.resetInputAddress();
    if (this.addresses) {
      this.setAddresses([...this.addresses, response]);
    } else {
      this.setAddresses([response]);
    }
  };
  public readonly deleteAddress = async (id: string) => {
    const response = await AddressService.deleteAddress(id);
    this.setAddresses(response);
    console.log("deleteAddress", response);
  };

  public readonly updateAddress = async (id: string) => {
    const { kv, korp, client_comment, floor, entrance } = this.inputAddress;
    const response = await AddressService.updateAddress(id, { kv, korp, client_comment, floor, entrance });
    this.setAddresses(
      this.addresses!.map(ad => {
        if (ad.id === id) {
          return { ...response };
        }
        return ad;
      })
    );
  };
}
