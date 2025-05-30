/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from "./Category";
import { Product } from "./Product";

export interface CategoryDetail {
  [x: string]: any;
  id: string;
  name: string;
  category?: Category; // Thêm dòng này
  categoryId: string;
  product?: Product[];
  status?: boolean;
}
