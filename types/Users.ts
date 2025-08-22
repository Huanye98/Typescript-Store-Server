export interface User {
  userId: number;
  role: "admin" | "user";
  cartId?: number;
}
export interface cartData {
  product_id: number;
  quantity: number;
  user_id: number;
  cart_id: number;
}
export interface CartItem {
  imageurl: string;
  product_name: string;
  product_price: number;
  product_id: number;
  quantity: number;
  discount: number;
  final_price: number;
}

export interface Transaction{
  paymentId: number,
  userId: number,
  amount: number,
  currency: string,
  status: string,
  clientSecret: string
}
export interface User {
  userId: number;
  role: "admin" | "user";
  cartId?: number;
}
