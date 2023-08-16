export enum CartScreens {
  CART_HOME = "CART_HOME",
  CHECKOUT = "CHECKOUT",
  ORDER_FORM = "ORDER_FORM",
}
const { CART_HOME, CHECKOUT, ORDER_FORM } = CartScreens;

export type CartStackParamList = {
  [CART_HOME]: undefined;
  [CHECKOUT]: { addressAdded?: boolean };
  [ORDER_FORM]: undefined;
};
