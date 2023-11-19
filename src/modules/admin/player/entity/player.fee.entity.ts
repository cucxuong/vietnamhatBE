import { ClothesSize, StandardColor } from '../../tournament/utils/type';

export class ClothesDetailFee {
  size: ClothesSize;
  color: StandardColor;
  quantity: number;
  price: number;
}

export class PlayerDetailFee {
  base: number;
  lunch: number;
  bus: number;
  jerseys: {
    black: ClothesDetailFee[];
    white: ClothesDetailFee[];
    price: number;
  };
  shorts: {
    black: ClothesDetailFee[];
    white: ClothesDetailFee[];
    price: number;
  };
  disc: {
    quantity: number;
    price: number;
  };
}

export class PlayerFee {
  playerCode: string;
  totalFee: number;
  totalForeign: number;
  exchangeRate: number;
  currency: string;
  detail: PlayerDetailFee;
}
