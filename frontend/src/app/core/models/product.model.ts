export type ProductCategory = 'vela' | 'home-spray' | 'difusor';

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  fragrance: string;
  description: string;
  price: number;
  imagePlaceholder: string;
  weightG: number;
}
