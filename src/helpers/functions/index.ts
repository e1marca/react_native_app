import { ImageSourcePropType, ImageURISource } from "react-native";
import { ProcessedAddress } from "src/stores/addressStore/types";

export const getImageSource = (url: string | null): ImageURISource | ImageSourcePropType => {
  const getDefaultImage = (): ImageSourcePropType => require("icons/emptyImage.png");

  return url ? { uri: url } : getDefaultImage();
};

export const formatPhoneNumber = (phoneNumber: string) => {
  let cleaned = ("" + phoneNumber).replace(/\D/g, "");
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3] + "-" + match[4];
  }

  match = cleaned.match(/^(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }

  match = cleaned.match(/^(\d{3})(\d{3})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2];
  }

  match = cleaned.match(/^(\d{3})$/);
  if (match) {
    return "(" + match[1];
  }

  return phoneNumber;
};

export const truncateText = (inputText: string, maxLength: number) => {
  let truncated = inputText.slice(0, maxLength).replace(/\s+/g, " ").trim();
  if (inputText.length > maxLength) {
    truncated += "...";
  }
  return truncated;
};

export const toMajorCurrencyUnit = (amount: number): number => {
  return Math.floor(amount / 100);
};

export const formatAddress = (address: ProcessedAddress) => {
  const { street, dom, kv, korp, entrance, floor } = address;
  return `${street} д. ${dom} ${kv !== "" ? `кв. ${kv}` : ""} ${korp !== "" ? `корпус ${korp}` : ""} ${
    entrance !== "" ? `подъезд ${entrance}` : ""
  } ${floor !== "" ? `этаж ${floor}` : ""}`;
};
