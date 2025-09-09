export interface Product {
  id: number;
  name: string;
  nameAr: string;
  price: number;
  barcode?: string;
  recipeId?: number;
  categoryId?: number;
}

export interface CartItem extends Product {
  quantity: number;
  discount: number; // percentage
}

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  totalDiscountValue: number;
  serviceCharge: number;
  finalTotal: number;
  paymentMethod: "cash" | "card";
  createdAt: Date;
  customer?: Customer;
  orderType: OrderType;
  orderId: number;
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

export interface PurchaseItem {
    rawMaterialId: number;
    name: string;
    nameAr: string;
    quantity: number;
    price: number;
}

export interface Purchase {
    id: string;
    supplierId: number;
    items: PurchaseItem[];
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

export interface RecipeItem {
    rawMaterialId: number;
    quantity: number;
}

export interface Recipe {
    id: number;
    name: string;
    items: RecipeItem[];
}

export interface Category {
    id: number;
    name: string;
    nameAr: string;
}

export interface Table {
  id: number;
  name: string;
  cart: CartItem[];
  selectedCustomerId: number | null;
}

export interface HeldOrder {
  id: number;
  name: string;
  cart: CartItem[];
  orderType: OrderType;
  orderId: number;
  selectedCustomerId: number | null;
  heldAt: Date;
}


export interface Expense {
    id: number;
    shiftId: number;
    description: string;
    amount: number;
    createdAt: Date;
}

export interface CashDrawerEntry {
    id: number;
    shiftId: number;
    type: 'cash_in' | 'cash_out';
    amount: number;
    reason: string;
    createdAt: Date;
}

export interface Shift {
    id: number;
    startTime: Date;
    endTime: Date | null;
    startingCash: number;
    endingCash: number | null;
    totalSales: number;
    totalExpenses: number;
    status: 'open' | 'closed';
}

export interface Settings {
    storeName: string;
    address: string;
    phone: string;
    currency: string;
    taxRate: number;
    receiptHeader: string;
    receiptFooter: string;
    enableTables: boolean;
    printerName?: string;
    printerConnectionType?: 'bluetooth' | 'usb' | 'network';
    printerIpAddress?: string;
    printerPaperWidth?: '58mm' | '80mm';
}
