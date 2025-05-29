import { Product } from "./Product";
import { Supplier } from "./Supplier";

export interface ImportTicket {
  id: number;
  date: string;
  total: number;
  status: boolean;
  supplierEntity: Supplier;
  importTicketDetails: Array<{
    id: number;
    quantity: number;
    importPrice: number;
    productEntity: Product;
  }>;
}
