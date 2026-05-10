export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  hasGiftCard?: boolean;
}

export interface Category {
  name: string;
  slug: string;
  count?: number;
  sub?: string[];
}
