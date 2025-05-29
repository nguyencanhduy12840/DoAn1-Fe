import { CategoryDetail } from "./CategoryDetail";

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  productImage: string;
  status: boolean;
  categoryDetails: CategoryDetail[];
}
