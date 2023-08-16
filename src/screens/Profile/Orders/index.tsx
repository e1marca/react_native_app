import React, { useEffect } from "react";
import { NoOrders } from "./NoOrders";
import { useRootStore } from "src/hooks/useRootStore";
import { useFetch } from "src/hooks/useFetch";
import { OrderList } from "./OrdersList";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { observer } from "mobx-react-lite";

export const Orders: React.FC = observer(() => {
  const {
    orderStore: { getOrders, orders },
  } = useRootStore();
  const { invokeApi: invokeGetOrders, isLoading: isLoadingGetOrders } = useFetch(getOrders);

  useEffect(() => {
    invokeGetOrders();
  }, [invokeGetOrders]);
  console.log("orders", orders);

  if (isLoadingGetOrders) {
    return <LoadingIndicator />;
  }

  if (!orders.length) {
    return <NoOrders />;
  }

  return <OrderList orders={orders} />;
});
