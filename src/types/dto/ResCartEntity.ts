import { CartDetail } from "./CartDetailDTO";

export interface ResCartEntity {
  id: number;
  sum: number;
  userEntity: {
    username: string;
  };
  cartDetailEntities: CartDetail[];
}
