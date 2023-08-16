import { makeAutoObservable } from "mobx";
import { cartService } from "./service";
import { AddProductToCartParams, Cart } from "./types";
import RootStore from "../rootStore";

export class CartStore {
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);
  }

  public cart = {} as Cart;

  public get cartItems() {
    return this.cart?.items;
  }
  public readonly setCart = (value: Cart) => {
    this.cart = value;
  };

  public readonly addProductToCart = async ({ topping_ids, quantity, item_id }: AddProductToCartParams) => {
    console.log("addProductToCart");
    const response = await cartService.addProductToCart({ topping_ids, quantity, item_id });
    this.setCart(response);
    console.log("this.cart", this.cart);
  };

  public readonly removeProductFromCart = async (item_id: string, topping_ids?: string[]) => {
    console.log("removeProductFromCart");
    const response = await cartService.removeProductFromCart({ item_id, quantity: 0, topping_ids });
    console.log("removeProduct", response);
    this.setCart(response);
  };
  public readonly cleanCart = async () => {
    console.log("cleanCart");
    const response = await cartService.cleanCart();
    this.setCart({} as Cart);
    console.log("cleancart", response);
  };
  public readonly addCoupled = async () => {
    console.log("addCoupled");
    const response = await cartService.addCoupled();
    console.log(response);
    this.setCart(response);
  };
  public readonly repeatOrder = async (item_id: string) => {
    console.log("repeatOrder");
    const response = await cartService.repeatOrder(item_id);
    console.log("repeatOrder", response);
    this.setCart(response);
  };
}
