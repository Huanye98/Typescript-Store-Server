export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  isavaliable: boolean;
  discountvalue: number;
  imageurl: string;
  category: string;
  collection_id: number;
  is_featured: boolean;
  stock: number;
  finalPrice?: number;
}
export interface Filters {
  id?: number;
  category?: string;
  collection?: string;
  sort?: string;
  isavaliable?: boolean;
  is_featured?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProductInput{
    name: string;
    price: number;
    description: string;
    isavaliable: boolean;
    discountvalue: number;
    imageurl: string;
    category: string;
    collection_id: number;
    is_featured: boolean;
    stock: number;
}
export interface ProductUpdates {
  name: string;
  is_printful: string;
  discountvalue: number;
  finalPrice: number;
  base_price: number;
  description: string;
  isavaliable: string;
  imageurl: string;
  category: string;
  collection: string;
  is_featured: boolean;
  stock: number | undefined;
}