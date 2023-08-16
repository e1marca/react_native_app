import React from "react";
import { View, StyleSheet } from "react-native";
import { ProductList } from "../ProductList";
import { CategoryItem } from "src/stores/catalogStore/types";
import { MyAppText } from "src/shared/Widgets/MyAppText";
import { observer } from "mobx-react-lite";
import { useRootStore } from "src/hooks/useRootStore";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";

interface UserSearchResultsProps {
  results: CategoryItem[];
}
export const UserSearchResults: React.FC<UserSearchResultsProps> = observer(({ results }) => {
  const {
    catalogStore: { userSearchResultsIsLoading },
  } = useRootStore();
  return (
    <View style={styles.searchContainer}>
      <MyAppText style={styles.text}>Результаты поиска:</MyAppText>
      {userSearchResultsIsLoading ? <LoadingIndicator /> : <ProductList products={results} />}
    </View>
  );
});

const styles = StyleSheet.create({
  searchContainer: { flex: 1, backgroundColor: "#F4F4F4" },
  text: {
    fontSize: 16,
    fontWeight: "400",
    color: "#3D4250",
    opacity: 0.5,
    padding: 20,
    paddingBottom: 10,
  },
});
