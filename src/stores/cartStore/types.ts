export interface CartItem {
  item_id: string;
  _id: string;
  title: string;
  descr: string;
  topping_ids: string[];
  choosen_toppings: {
    id: string;
    title: string;
  }[];
  price: number;
  old_price: number;
  quantity: number;
  icon_url: string;
}

export interface Cart {
  id: string;
  count: number;
  items: CartItem[];
  total_quantity: number;
  sum_hash: number;
  total_sum: number;
  need_coupled_count: number;
}

export interface AddProductToCartParams {
  topping_ids?: string[];
  quantity: number;
  item_id: string;
}

export interface CartResponse {
  cart: Cart;
}
