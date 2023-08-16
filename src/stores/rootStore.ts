import { makeAutoObservable } from "mobx";
import { AuthStore } from "./authStore";
import { CatalogStore } from "./catalogStore";
import { CartStore } from "./cartStore";
import { MainStore } from "./mainStore";
import { OrderStore } from "./orderStore";
import { AddressStore } from "./addressStore";
import { ChatStore } from "./chatStore";

export class RootStore {
  readonly authStore: AuthStore;
  readonly cartStore: CartStore;
  readonly catalogStore: CatalogStore;
  readonly mainStore: MainStore;
  readonly addressStore: AddressStore;
  readonly orderStore: OrderStore;
  readonly chatStore: ChatStore;

  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore(this);
    this.cartStore = new CartStore(this);
    this.catalogStore = new CatalogStore(this);
    this.mainStore = new MainStore(this);
    this.addressStore = new AddressStore(this);
    this.orderStore = new OrderStore(this);
    this.chatStore = new ChatStore(this);
  }
}

export default RootStore;
