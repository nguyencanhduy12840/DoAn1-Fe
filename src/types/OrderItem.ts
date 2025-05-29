import { Product } from "./Product";

export interface OrderItem {
  product: Product;
  amount: number;
  isSelected: boolean;
}
