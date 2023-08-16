export interface InputAddress {
  city: string;
  street: string;
  dom: string;
  kv: string;
  entrance: string;
  floor: string;
  korp: string;
  client_comment: string;
  location: Location;
}

export interface ProcessedAddress {
  id: string;
  street: string;
  dom: string;
  kv: string;
  korp: string;
  floor: string;
  entrance: string;
  doorcode: string;
  client_comment: string;
  map_addr: string;
  full_addr: string;
  full_addr_with_city: string;
  city: string;
  district_id: string | null;
  district: District;
  item_stocks_report: ItemStocksReport[];
  location: Location;
  can_user_edit: boolean;
}

export interface District {
  id: string;
  title: string;
}

export interface ItemStocksReport {
  id: string;
  title: string;
  quantity: number;
  item: object; // Specify the exact type for this if possible
}

export interface Location {
  lat: number | null;
  lng: number | null;
}

export interface GeocodeRequest {
  prms: {
    noCode: boolean;
  };
  address: ProcessedAddress;
}

export interface GetAddressesResponse {
  addresses: ProcessedAddress[];
}

export interface ReversGeocodeResponse {
  address: { dom: string; city: string; street: string };
  district_id: string | null;
}
export interface UpdateAddressResponse {
  address: ProcessedAddress;
}
