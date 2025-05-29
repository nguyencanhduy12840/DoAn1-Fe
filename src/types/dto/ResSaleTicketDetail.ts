import { Product } from "../Product";
import { Voucher } from "../Voucher";

export interface ResSaleTicketDetail {
  listProduct: Array<{
    product: Product;
    quantity: number;
  }>;
  voucher: Voucher;
  status: string;
}
