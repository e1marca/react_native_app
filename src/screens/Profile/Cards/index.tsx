import React from "react";
import { NoCards } from "./NoCards";
import { observer } from "mobx-react-lite";
import { useRootStore } from "src/hooks/useRootStore";
import { CardList } from "./CardList";

export const Cards: React.FC = observer(() => {
  const {
    authStore: {
      mobileToken: {
        client_info: { cards },
      },
    },
  } = useRootStore();

  if (!cards?.length) {
    return <NoCards />;
  }

  return <CardList />;
});
