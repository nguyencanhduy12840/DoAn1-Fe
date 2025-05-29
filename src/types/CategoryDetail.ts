/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "./Product";

export interface CategoryDetail {
  [x: string]: any;
  id: string;
  name: string;
  categoryId: string;
  product?: Product[];
  status?: boolean;
}
