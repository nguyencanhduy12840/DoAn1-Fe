export interface ProductDTO {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  productImage: File | null;
  categoryDetailId: number[];
}
