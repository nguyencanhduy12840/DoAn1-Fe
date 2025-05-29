export interface ReqSaleTicket {
  username: string;
  date: string;
  total: number;
  voucherId: number;
  listProducts: Array<{
    productName: string;
    quantity: number;
  }>;
}
