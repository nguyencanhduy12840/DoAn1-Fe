export interface ReqImportTicket {
  supplierName: string;
  date: string;
  totalPrice: number;
  listProducts: Array<{
    productName: string;
    importPrice: number;
    quantity: number;
  }>;
}
