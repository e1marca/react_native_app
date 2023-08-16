import { ProcessedAddress } from "../addressStore/types";
import { CategoryItem } from "../catalogStore/types";

export interface Order {
  id: string;
  total_sum: number;
  delivery_price: number;
  items_sum: number;
  bonus_sum: number;
  pay_sum: number;
  delivery_type: DeliveryType;
  comment: string;
  fio: string;
  address: ProcessedAddress | null;
  time_from: string;
  time_to: string;
  date: string;
  phone: string;
  items_count: number;
  district_id: string;
  maximum_bonus_spend: number;
  pay_type_id: string;
  pay_types: [string, string][];
  promo_code_text: string;
  promo_sum: number;
  delivery_pickup_point: string;
  status: string;
  status_symbol: OrderStatus;
  items: CategoryItem[];
  can_cancel: boolean;
}
export interface OrderResponse {
  order: Order;
}

export interface CartResponse {
  cart: Cart;
}

export interface Cart {
  items: CartItem[];
}

export interface CartItem {
  // Define the properties for the cart item entity
}

export interface AddProductToCartParams {
  toppings_ids: string[];
  quantity: number;
  item_id: string;
}

export enum DeliveryType {
  delivery = "delivery",
  pickup = "pickup",
}

export interface UpdateOrderParams {
  address_id: string;
  fio: string;
  phone: string;
  date: string;
  time_from: string;
  time_to: string;
  comment: string;
  delivery_type: DeliveryType;
  time_gap: string;
  delivery_pickup_point: string;
  pay_type_id: string;
  district_id: string;
  bonus_sum: number;
  card_id: string;
  promo_code_text: string;
  additional_fields_collected: AdditionalField[];
}

export interface AdditionalField {
  type: string;
  title: string;
  default_value: string;
  value: string;
  values: string;
  is_required: boolean;
}

export interface FieldsToUpdateOrder {
  address_id: string;
  address: { id: string };
  delivery_type: DeliveryType;
  pay_type_id: string;
  date: string;
  fio: string;
  comment: string;
  promo_code_text: string;
  promo_sum: string;
  time_from: string;
  time_to: string;
  time_gap: string;
  delivery_pickup_point: string;
  bonus_sum: number;
}

export interface District {
  id: string;
  title: string;
}
export interface Period {
  delivery_price: number;
  id: string;
  period: string[];
  title: string;
}

export interface OrderPeriodResponse {
  date: string;
  delivery_price: number;
  district_id: string;
  district_list: District[];
  is_edge_date: boolean;
  period: Period;
  periods: Period[];
}
interface Client {
  _id: string;
  addresses: ProcessedAddress[];
  balance: number;
  bonuses: number;
}

export interface CurrentOrder {
  _id: string;
  additional_fields_collected: any[];
  address: ProcessedAddress;
  address_model: ProcessedAddress;
  bonus_sum: number;
  bottles_return: number;
  can_cancel: boolean;
  client: Client;
  client_id: { $oid: string };
  client_short: string;
  client_short_details: {
    bonuses: number;
    fio: string;
    phones: string[];
  };
  comment: string;
  company_id: { $oid: string };
  created_at: string;
  date: string;
  delivery_pickup_point: string;
  delivery_type: string;
  district_id: string;
  drivers_comment: string | null;
  fio: string;
  gap_created_at: string | null;
  id: string;
  inner_comment: string | null;
  is_bonus_operation: boolean;
  is_delivered: boolean;
  is_rated: boolean;
  items: CategoryItem[];
  marker_params: {
    color: string;
    fontColor: string;
    opacity: number;
  };
  order_num: number;
  paid: boolean;
  pay_sum: number;
  pay_type: {
    driver_can_collect_money: boolean;
    id: string;
    is_just_send: boolean;
    system_name: string;
    title: string;
  };
  pay_type_id: string;
  payment_type: string;
  persisted: boolean;
  position: string | null;
  promo_code_text: string;
  promo_sum: number;
  rating: number;
  review_comment: string | null;
  status: string;
  status_symbol: OrderStatus;
  sum: number;
  time_from: string;
  time_gap: string | null;
  time_to: string;
}

export enum OrderStatus {
  waiting_approve = "waiting_approve",
  auto = "auto",
  warehouse = "warehouse",
  waiting_delivery = "waiting_delivery",
  delivered = "delivered",
  cancelled = "cancelled",
  not_there = "not_there",
  refued = "refued",
}
