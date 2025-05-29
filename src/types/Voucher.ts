export interface Voucher {
  id: string;
  name: string;
  value: number | "";
  isPercentage: boolean | number | "";
  status?: boolean;
}
