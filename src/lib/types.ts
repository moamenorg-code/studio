export interface Product {
  id: number;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  dataAiHint: string;
}

export interface CartItem extends Product {
  quantity: number;
  discount: number; // percentage
}

export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  totalDiscountValue: number;
  serviceCharge: number;
  finalTotal: number;
  paymentMethod: "cash" | "card";
  createdAt: Date;
}
