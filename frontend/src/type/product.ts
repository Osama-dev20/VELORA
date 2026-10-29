export type Product = {
  id: string;
  name: string;
  category: string;
  audience: string;
  image: string;
  price: number;
  badge?: string;
  sizes?: string[];
};