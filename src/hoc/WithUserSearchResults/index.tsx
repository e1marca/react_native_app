import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "src/hooks/useRootStore";
import { UserSearchResults } from "src/shared/Catalog/UserSearchResults";

interface WithUserSearchResultsProps {
  header?: React.ReactElement;
}

export const withUserSearchResults = <T,>(Component: React.ComponentType<T>) =>
  observer((props: T & WithUserSearchResultsProps) => {
    const { catalogStore } = useRootStore();
    const { userSearchResults } = catalogStore;

    return userSearchResults ? <UserSearchResults results={userSearchResults} /> : <Component {...props} />;
  });
