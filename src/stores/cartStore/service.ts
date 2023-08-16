import { instance } from "configs/apiConfig";
import { AddProductToCartParams, Cart, CartResponse } from "./types";

export const cartService = {
  addProductToCart: async ({ topping_ids, quantity, item_id }: AddProductToCartParams): Promise<Cart> => {
    const response = await instance.post<CartResponse>("/v3/carts", {
      topping_ids,
      quantity,
      item_id,
    });
    return response.data.cart;
  },
  removeProductFromCart: async ({ quantity, item_id, topping_ids }: AddProductToCartParams): Promise<Cart> => {
    const response = await instance.post<CartResponse>("/v3/carts", {
      quantity,
      item_id,
      topping_ids,
    });
    return response.data.cart;
  },
  addCoupled: async (): Promise<Cart> => {
    const response = await instance.post<CartResponse>("v3/carts/coupled", {});
    return response.data.cart;
  },
  repeatOrder: async (order_id: string): Promise<Cart> => {
    const response = await instance.post<CartResponse>("v3/carts/repeat", { order_id });
    return response.data.cart;
  },
  cleanCart: async (): Promise<Cart> => {
    const response = await instance.post<CartResponse>("v3/carts/clean", {});
    return response.data.cart;
  },
};
