import { Product } from "../Product";

export interface CartDetail {
  id: number;
  quantity: number;
  price: number;
  productEntity: Product;
}
