import { Cart } from "../cartStore/types";
import { CurrentOrder } from "../orderStore/types";

export interface Location {
  lat: number;
  lng: number;
}

export interface CityBranch {
  id: string;
  title: string;
  location: Location;
}

export enum LoginType {
  client_call = "client_call",
  sms = "sms",
  email = "email",
}

interface AuthType {
  login_type: LoginType;
  phones_login_info: {
    phone_mask: string;
    phone_mask_nums_length: number;
    phone_start: string;
  };
}

interface CurrencyHash {
  id: string;
  name: string;
  name_long: string;
  name_one: string;
  name_plur: string;
  symbol: string;
  symbol_html: string;
}

export interface CompanyInfo {
  id: string;
  mobile_logo_url: string | null;
  mobile_menu_logo_url: string | null;
  mobile_min_sum: number;
  mobile_auth_required: boolean;
  mobile_to_cart_after_add: boolean;
  mobile_chat_enabled: boolean;
  city_branches: CityBranch[];
  auth_type: AuthType;
  currency_hash: CurrencyHash;
  mobile_delivery_type: MobileDeliveryType;
  pickup_points: string[];
  cart_coupled: { need_tare_txt: string; add_tare_btn_txt: string };
  mobile_slider_params: {
    enabled: boolean;
    change_speed: number;
  };
  is_bonus_avaliable: boolean;
  is_promocodes: boolean;
  bonus_total_percent: number;
  bonus_info: string;
}

export interface ClientInfo {
  _id: string;
  addresses: any[];
  bonuses: number;
  bottles: number;
  cards: PaymentCard[];
  client_type: string;
  coolers_rent_count: number;
  created_at: string;
  current_order: null;
  debt: null;
  deletion_asked: boolean;
  districts: any[][];
  do_not_remind_automatically: boolean;
  email: null | string;
  fio: null | string;
  has_rek: boolean;
  id: {
    $oid: string;
  };
  last_address: null | string;
  last_address_str: string;
  last_orders: CurrentOrder[];
  next_order_date_str: null | string;
  order_per_days: number;
  orders_count: number;
  persisted: boolean;
  phone: string;
  review_json: null | string;
  unreaded_client_messages_count: number;
  unreaded_messages_count: number;
  updated_at: string;
  ur_acccount_type: string;
  ur_account_number: string;
  ur_accounter_fio: string;
  ur_address: string;
  ur_bank_bik: string;
  ur_bank_title: string;
  ur_dir: string;
  ur_dir_rod: string;
  ur_dir_sokr: string;
  ur_email: string;
  ur_inn: string;
  ur_invoice_fio: string;
  ur_invoice_position: string;
  ur_kor_account: string;
  ur_kpp: string;
  ur_off_address: string;
  ur_ogrn_ip: string;
  ur_phone: string;
  ur_store_position: string;
  ur_store_sign: string;
  ur_title: string;
  ur_vat: string;
}

export interface District {
  id: string;
  title: string;
  zones: { coords: [number, number][] }[];
}

export interface PaymentCard {
  active: boolean;
  cvn: any;
  id: string;
  masked_card_num: string;
  title: string;
}

export interface CoupledMobileTokens {
  client_info: ClientInfo;
  email: string;
  phone: string;
  token: string;
}

export enum MobileDeliveryType {
  delivery_and_pickup = "delivery_and_pickup",
  only_delivery = "only_delivery",
  only_pickup = "only_pickup",
}
export interface Slides {
  id: string;
  image_url: string;
  link: string;
}
export interface MobileToken {
  token: string;
  company_info: CompanyInfo;
  client_info: ClientInfo;
  city_branch: CityBranch;
  current_order: CurrentOrder;
  cart: Cart;
  uniq_socket_hash: string;
  districts: District[];
  coupled_mobile_tokens: CoupledMobileTokens[];
  slides: Slides[];
}

export interface MobileTokenServerResponse {
  mobile_token: MobileToken;
}
