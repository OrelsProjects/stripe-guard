export type Interval = "month" | "year";

export interface PriceStructure {
  id: string;
  price: number;
  interval: Interval;
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
