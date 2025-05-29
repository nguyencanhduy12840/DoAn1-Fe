import { CategoryDetail } from "./CategoryDetail";

export interface Category {
  id: string;
  name: string;
  status?: boolean;
  categoryDetails?: CategoryDetail[];
}
