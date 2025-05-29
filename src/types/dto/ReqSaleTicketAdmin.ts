export interface ReqSaleTicketAdmin {
  fullName: string;
  phoneNumber: string;
  address: string;
  date: string;
  totalPrice: number;
  voucherId: number;
  listProducts: Array<{
    productName: string;
    quantity: number;
  }>;
}
