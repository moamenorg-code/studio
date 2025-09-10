export interface Product {
  id: string;
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
  deliveryRepId?: number;
  userId?: number;
}

export interface Customer {
    id: number;
    name: string;
    phone: string;
    address: string;
}

export interface DeliveryRep {
    id: number;
    name: string;
    phone: string;
    commissionRate: number; // Percentage
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
    barcode?: string;
    cost?: number;
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
  overallDiscount: number;
  serviceCharge: number;
}

export interface HeldOrder {
  id: number;
  name: string;
  cart: CartItem[];
  orderType: OrderType;
  orderId: number;
  selectedCustomerId: number | null;
  heldAt: Date;
  overallDiscount: number;
  serviceCharge: number;
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
    deliveryFee: number;
    printerName?: string;
    printerConnectionType?: 'bluetooth' | 'usb' | 'network';
    printerIpAddress?: string;
    printerPaperWidth?: '58mm' | '80mm';
}

export type Permission = 
    | 'access_dashboard'
    | 'access_sales_history'
    | 'access_products'
    | 'access_inventory'
    | 'access_customers'
    | 'access_purchases'
    | 'access_delivery'
    | 'access_shifts'
    | 'access_settings'
    | 'access_tables'
    | 'access_reports';

export interface Role {
    id: number;
    name: string;
    permissions: Partial<Record<Permission, boolean>>;
}

export interface User {
    id: number;
    name: string;
    pin: string; // 4-digit PIN
    roleId: number;
}


export type Language = "en" | "ar";
export type ActiveView = "sales" | "dashboard" | "history" | "products" | "customers" | "purchases" | "inventory" | "shifts" | "settings" | "tables" | "deliveryReps" | "unauthorized" | "reports";

export interface ActiveOrder {
  type: OrderType;
  id: number;
}

export interface AppData {
    products: Product[];
    categories: Category[];
    recipes: Recipe[];
    rawMaterials: RawMaterial[];
    customers: Customer[];
    suppliers: Supplier[];
    purchases: Purchase[];
    deliveryReps: DeliveryRep[];
    users: User[];
    roles: Role[];
    shifts: Shift[];
    sales: Sale[];
    expenses: Expense[];
    cashDrawerEntries: CashDrawerEntry[];
    settings: Settings;
    tables: Table[];
}

export type FirestoreStatus = 'connecting' | 'connected' | 'error';
