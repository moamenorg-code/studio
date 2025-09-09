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

export interface Customer {
    id: number;
    name: string;
    phone: string;
    address: string;
}

export interface Supplier {
    id: number;
    name: string;
    phone: string;
    address: string;
}

export interface Purchase {
    id: string;
    supplierId: number;
    items: { name: string, nameAr: string, quantity: number, price: number }[];
    total: number;
    createdAt: Date;
}

export interface RawMaterial {
    id: number;
    name: string;
    nameAr: string;
    unit: string; // e.g., kg, liter, piece
    stock: number;
}
