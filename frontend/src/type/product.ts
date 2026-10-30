export type Product = {
  id: string;
  name: string;
  category: string;
  audience: "Men" | "Women" | "Kids" | "Accessories";
  price: number;
  image: string;
};