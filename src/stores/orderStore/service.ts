import { instance } from "configs/apiConfig";
import { FieldsToUpdateOrder, Order, OrderPeriodResponse, OrderResponse, UpdateOrderParams } from "./types";

export const orderService = {
  convertCartToOrder: async (): Promise<{ order: Order }> => {
    const response = await instance.post<{ order: Order }>("v3/orders/start", {});
    return response.data;
  },

  updateTimePeriods: async (district_id?: string, date?: string, period_id?: string): Promise<OrderPeriodResponse> => {
    const requestData = { district_id, date };
    const response = await instance.post<OrderPeriodResponse>("/v3/time_periods", requestData);
    return response.data;
  },

  updateCommonParams: async (params?: Partial<UpdateOrderParams>): Promise<OrderResponse> => {
    const response = await instance.post("/v3/orders/update_common_params", {
      order: {
        ...params,
      },
    });
    return response.data;
  },

  applyPromoCode: async (order: FieldsToUpdateOrder): Promise<{ order: Order; errors: {} }> => {
    const requestData = { order };
    const response = await instance.post<{ order: Order; errors: {} }>("/v3/orders/apply_promo_code", requestData);
    return response.data;
  },

  makeOrder: async (): Promise<{ message: string }> => {
    const response = await instance.post<{ message: string }>("/v3/orders/make", {});
    return response.data;
  },

  payOrder: async (): Promise<{ redirect: string; status: string }> => {
    const response = await instance.post<{ redirect: string; status: string }>("/v3/orders/pay", {});
    return response.data;
  },

  payWithNewCard: async (): Promise<any> => {
    const response = await instance.post("/v3/orders/pay_new_card", {});
    return response.data;
  },

  getOrders: async (): Promise<{ orders: Order[] }> => {
    const response = await instance.get<{ orders: Order[] }>("/v3/orders/list");
    return response.data;
  },

  submitReview: async (rating: number, comment: string): Promise<{ status: string }> => {
    const requestData = { rating, comment };
    const response = await instance.post<{ status: string }>("/v3/orders/review", requestData);
    return response.data;
  },

  cancelOrder: async (order_id: string): Promise<{ order: Order }> => {
    const response = await instance.post<{ order: Order }>(`/v3/orders/${order_id}/cancel`, {});
    return response.data;
  },
};
