import { configureCalendarLocale } from "configs/calendar";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useFetch } from "src/hooks/useFetch";
import { useRootStore } from "src/hooks/useRootStore";
import { AppScreens } from "src/screens";

configureCalendarLocale();

export const App = observer(() => {
  const {
    mainStore: { initialize },
  } = useRootStore();
  const { invokeApi, isLoading } = useFetch(initialize);

  useEffect(() => {
    invokeApi();
  }, [invokeApi]);

  return <AppScreens mainStoreIsLoading={isLoading} />;
});
