import { Product } from "./Product";
import { User } from "./User";
import { Voucher } from "./Voucher";

export interface OrderTicket {
  id: string;
  total: number;
  date: string;
  status: string;
  voucherEntity?: Voucher;
  saleTicketDetails: Array<{
    id: number;
    quantity: number;
    productEntity: Product;
  }>;
  userEntity: User;
}
