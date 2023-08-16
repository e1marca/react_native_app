import React from "react";
import { FlatList } from "react-native";
import { ProductsListItem } from "./ProductListItem";
import { observer } from "mobx-react-lite";
import { CategoryItem } from "src/stores/catalogStore/types";
import { NoProducts } from "./NoProducts";

interface ProductListProps {
  products: CategoryItem[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = observer(({ products, onRefresh, isLoading }) => {
  return (
    <>
      {products.length ? (
        <FlatList
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          onRefresh={onRefresh}
          refreshing={isLoading}
          data={products}
          renderItem={item => <ProductsListItem item={item.item} />}
          keyExtractor={item => item._id}
          numColumns={1}
        />
      ) : (
        <NoProducts />
      )}
    </>
  );
});
