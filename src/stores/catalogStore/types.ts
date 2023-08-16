export interface Category {
  _id: string;
  categories: Category[];
  descr: string | null;
  icon_url: string;
  mobile_descr: string | null;
  title: string;
}
export interface Image {
  id: string;
  original: string;
  position: number;
  show: string;
  thumb: string;
}

export interface PriceConditions {
  price: number;
  quantity: number;
}
export interface CategoryItem {
  _id: string;
  actual_price: number;
  art: string;
  avaliable_in_cities: string[];
  category_id: string;
  coupled_item_id: string | null;
  descr: string;
  descr_short: string | null;
  has_toppings: boolean;
  icon_url: string;
  id: string;
  images: Image[];
  price: number;
  price_conditions: PriceConditions[];
  price_old: number | null;
  quantity: number;
  quants_conds: any[];
  recommendations: any[];
  service: string | null;
  title: string;
  toppings: CategoryItem[];
  bonus_sum: number;
}

export interface Catalog {
  categories: Category[];
  category: Category | null;
  items: CategoryItem[];
}

export interface ProductDetailsServerResponse {
  category: Category;
  item: CategoryItem;
}

export interface GetCatalogParams {
  categoryId?: string;
  q?: string;
}
