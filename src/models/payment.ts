export interface PriceStructure {
  id: string;
  price: number;
  tokens: number;
  currency: string;
}

export interface Product {
  id: string;
  name: string;
  noCreditCard?: boolean;
  priceStructure: PriceStructure;
  features: string[];
  recommended?: boolean;
}
