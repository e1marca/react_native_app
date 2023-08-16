import { makeAutoObservable, reaction } from "mobx";
import { orderService } from "./service";
import { DeliveryType, FieldsToUpdateOrder, Order, OrderPeriodResponse } from "./types";
import RootStore from "../rootStore";

export class OrderStore {
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);

    let previousRest: any = null;

    reaction(
      () => {
        const { promo_code_text, ...rest } = this.fieldsToUpdateOrder;
        return rest;
      },
      async updatedFields => {
        if (JSON.stringify(updatedFields) !== JSON.stringify(previousRest)) {
          previousRest = updatedFields;
          await this.updateCommonParams(updatedFields);
        }
      }
    );
  }

  public order: Order = {} as Order;
  public orderDatePeriod: OrderPeriodResponse = {} as OrderPeriodResponse;
  public minDateForOrder = "";
  public linkForPay = "";
  public isCommonParamsUpdating = false;
  public fieldsToUpdateOrder: FieldsToUpdateOrder = {
    address_id: "",
    address: { id: "" },
    delivery_type: DeliveryType.delivery,
    pay_type_id: "",
    date: "",
    fio: "",
    comment: "",
    promo_code_text: "",
    promo_sum: "",
    time_from: "",
    time_to: "",
    time_gap: "",
    delivery_pickup_point: "",
    bonus_sum: 0,
  };
  public orders: Order[] = [];
  public setOrders = (value: Order[]) => {
    this.orders = value;
  };
  public setCommonParamsUpdatingStatus = (updating: boolean) => {
    this.isCommonParamsUpdating = updating;
  };
  public setLinkForPay = (value: string) => {
    this.linkForPay = value;
  };
  public setMinDateForOrder = (value: string) => {
    this.minDateForOrder = value;
  };
  public updateMinDateForOrder = async (district_id: string, date: string, period_id?: string) => {
    console.log("updateMinDateForOrder");
    try {
      const response = await this.updateTimePeriods(district_id, date, period_id);
      console.log("response.is_edge_date", response?.is_edge_date);
      if (response?.is_edge_date === true) {
        const currentDate = new Date(response.date);
        currentDate.setDate(currentDate.getDate() + 1);
        const formattedDate = new Date(currentDate).toDateString();
        await this.updateMinDateForOrder(district_id, formattedDate);
      } else {
        this.setMinDateForOrder(response!.date);
        this.setFieldsToUpdateOrder({
          date: response!.date,
          time_from: response!.period.period[0],
          time_to: response!.period.period[1],
        });
      }
    } catch (error) {
      console.error("Failed to update time periods:", error);
    }
  };

  public updateCommonParams = async (params: Omit<FieldsToUpdateOrder, "promo_code_text">) => {
    if (Object.keys(this.order).length) {
      this.setCommonParamsUpdatingStatus(true);
      const response = await orderService.updateCommonParams(params);
      this.setCommonParamsUpdatingStatus(false);
      console.log("response.order", response.order);
      this.setOrder(response.order);
    }
  };

  private setOrderDatePeriod = (value: OrderPeriodResponse) => {
    this.orderDatePeriod = value;
  };

  public setFieldsToUpdateOrder = (value: Partial<FieldsToUpdateOrder>) => {
    console.log("setFieldsToUpdateOrder__", value);
    this.fieldsToUpdateOrder = { ...this.fieldsToUpdateOrder, ...value };
  };

  public convertCartToOrder = async (): Promise<void> => {
    console.log("convertCartToOrder");
    try {
      const response = await orderService.convertCartToOrder();
      this.setOrder(response.order);
      console.log("this.order", this.order);
    } catch (error) {
      console.error("Failed to convert cart to order:", error);
    }
  };

  public updateTimePeriods = async (
    district_id: string,
    date: string,
    period_id?: string
  ): Promise<OrderPeriodResponse | void> => {
    console.log("updateTimePeriods");
    try {
      const response = await orderService.updateTimePeriods(district_id, date, period_id);
      this.setOrderDatePeriod(response);
      console.log("time periods:", response);
      return response;
    } catch (error) {
      console.error("Failed to update time periods:", error);
    }
  };

  public applyPromoCode = async (): Promise<void> => {
    console.log("applyPromoCode");
    try {
      const response = await orderService.applyPromoCode(this.fieldsToUpdateOrder);
      console.log("applied promo code:", response);
      this.setOrder(response.order);
    } catch (error) {
      console.error("Failed to apply promo code:", error);
    }
  };

  public makeOrder = async (): Promise<string> => {
    console.log("makeOrder");
    try {
      const response = await orderService.makeOrder();
      console.log("order made:", response.message);
      this.rootStore.authStore.getOrUpdateToken();
      return response.message;
    } catch (error) {
      console.error("Failed to make order:", error);
      return "Failed to make order";
    }
  };

  public payOrder = async (): Promise<void> => {
    console.log("payOrder");
    try {
      const response = await orderService.payOrder();
      this.setLinkForPay(response.redirect);
    } catch (error) {
      console.error("Failed to pay order:", error);
    }
  };

  public payWithNewCard = async (): Promise<void> => {
    console.log("payWithNewCard");
    try {
      const response = await orderService.payWithNewCard();
      console.log("order paid with new card:", response);
    } catch (error) {
      console.error("Failed to pay order with new card:", error);
    }
  };

  public getOrders = async (): Promise<void> => {
    console.log("getOrders");
    try {
      const response = await orderService.getOrders();
      console.log("ordersList", response.orders);
      this.setOrders(response.orders);
    } catch (error) {
      console.error("Failed to list orders:", error);
    }
  };

  public submitReview = async (rating: number, comment: string): Promise<void> => {
    console.log("submitReview");
    try {
      const response = await orderService.submitReview(rating, comment);
      console.log("review status:", response.status);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  public cancelOrder = async (order_id: string): Promise<void> => {
    console.log("cancelOrder", order_id);
    try {
      const response = await orderService.cancelOrder(order_id);
      this.setOrder(response.order);
      console.log("cancelled order:", this.order);
      await this.rootStore.authStore.getOrUpdateToken();
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  public setOrder = (value: Order): void => {
    this.order = value;
  };
}
