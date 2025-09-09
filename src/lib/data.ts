import type { Product, Customer, Supplier, Purchase, RawMaterial, Expense, Shift, CashDrawerEntry, Recipe, Category, Table, DeliveryRep, Role, User } from './types';

export const categories: Category[] = [
    { id: 1, name: "Hot Drinks", nameAr: "مشروبات ساخنة" },
    { id: 2, name: "Pastries", nameAr: "معجنات" },
    { id: 3, name: "Cold Drinks", nameAr: "مشروبات باردة" },
    { id: 4, name: "Desserts", nameAr: "حلويات" },
    { id: 5, name: "Sandwiches", nameAr: "ساندويتشات" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Espresso",
    nameAr: "اسبريسو",
    price: 25.00,
    barcode: "860001",
    recipeId: 1,
    categoryId: 1,
  },
  {
    id: 2,
    name: "Latte",
    nameAr: "لاتيه",
    price: 35.50,
    barcode: "860002",
    recipeId: 2,
    categoryId: 1,
  },
  {
    id: 3,
    name: "Croissant",
    nameAr: "كرواسون",
    price: 22.75,
    barcode: "860003",
    recipeId: 3,
    categoryId: 2,
  },
  {
    id: 4,
    name: "Cheesecake",
    nameAr: "تشيز كيك",
    price: 45.00,
    barcode: "860004",
    categoryId: 4,
  },
  {
    id: 5,
    name: "Iced Tea",
    nameAr: "شاي مثلج",
    price: 30.25,
    barcode: "860005",
    categoryId: 3,
  },
  {
    id: 6,
    name: "Muffin",
    nameAr: "مافن",
    price: 28.00,
    barcode: "860006",
    categoryId: 2,
  },
    {
    id: 7,
    name: "Cappuccino",
    nameAr: "كابتشينو",
    price: 32.00,
    barcode: "860007",
    recipeId: 2,
    categoryId: 1,
  },
  {
    id: 8,
    name: "Orange Juice",
    nameAr: "عصير برتقال",
    price: 28.50,
    barcode: "860008",
    categoryId: 3,
  },
  {
    id: 9,
    name: "Club Sandwich",
    nameAr: "كلوب سندويتش",
    price: 55.00,
    barcode: "860009",
    categoryId: 5,
  },
];

export const customers: Customer[] = [
    { id: 1, name: "Ahmad Mahmoud", phone: "0501234567", address: "Riyadh, Saudi Arabia" },
    { id: 2, name: "Fatima Al-Ali", phone: "0557654321", address: "Jeddah, Saudi Arabia" },
    { id: 3, name: "Youssef Khaled", phone: "0531234568", address: "Dammam, Saudi Arabia" },
    { id: 4, name: "Sara Abdullah", phone: "0547654322", address: "Khobar, Saudi Arabia" },
    { id: 5, name: "Omar Hassan", phone: "0561112233", address: "Mecca, Saudi Arabia" },
    { id: 6, name: "Layla Murad", phone: "0598765432", address: "Riyadh, Saudi Arabia" },
    { id: 7, name: "Khaled Al-Faisal", phone: "0587654321", address: "Jeddah, Saudi Arabia" },
    { id: 8, name: "Noura Saad", phone: "0576543210", address: "Dammam, Saudi Arabia" },
];

export const deliveryReps: DeliveryRep[] = [
    { id: 1, name: "Khalid Ahmed", phone: "0512345678", commissionRate: 10 },
    { id: 2, name: "Mohammed Ali", phone: "0523456789", commissionRate: 12 },
    { id: 3, name: "Fahad Saleh", phone: "0534567890", commissionRate: 10 },
];


export const suppliers: Supplier[] = [
    { id: 1, name: "Modern Mills", phone: "011-234-5678", address: "Industrial City, Riyadh" },
    { id: 2, name: "Fresh Vegetables Co.", phone: "012-345-6789", address: "Central Market, Jeddah" },
];

export const rawMaterials: RawMaterial[] = [
    { id: 1, name: 'Coffee Beans', nameAr: 'حبوب البن', unit: 'kg', stock: 50 },
    { id: 2, name: 'Milk', nameAr: 'حليب', unit: 'liter', stock: 100 },
    { id: 3, name: 'Sugar', nameAr: 'سكر', unit: 'kg', stock: 200 },
    { id: 4, name: 'Flour', nameAr: 'دقيق', unit: 'kg', stock: 150 },
    { id: 5, name: 'Butter', nameAr: 'زبدة', unit: 'kg', stock: 40 },
    { id: 6, name: 'Eggs', nameAr: 'بيض', unit: 'piece', stock: 300 },
    { id: 7, name: 'Dough', nameAr: 'عجينة', unit: 'piece', stock: 50 },
];

export const recipes: Recipe[] = [
    { id: 1, name: "Espresso Shot", items: [{ rawMaterialId: 1, quantity: 0.02 }] },
    { id: 2, name: "Steamed Milk", items: [{ rawMaterialId: 1, quantity: 0.02 }, { rawMaterialId: 2, quantity: 0.2 }] },
    { id: 3, name: "Croissant Recipe", items: [{ rawMaterialId: 7, quantity: 1 }] },
];

export const tables: Table[] = [
    { id: 1, name: "T1", cart: [], selectedCustomerId: null },
    { id: 2, name: "T2", cart: [], selectedCustomerId: null },
    { id: 3, name: "T3", cart: [], selectedCustomerId: null },
    { id: 4, name: "T4", cart: [], selectedCustomerId: null },
    { id: 5, name: "T5", cart: [], selectedCustomerId: null },
    { id: 6, name: "T6", cart: [], selectedCustomerId: null },
];

export const roles: Role[] = [
    { 
        id: 1, 
        name: 'Admin', 
        permissions: {
            access_dashboard: true,
            access_sales_history: true,
            access_products: true,
            access_inventory: true,
            access_customers: true,
            access_purchases: true,
            access_delivery: true,
            access_shifts: true,
            access_settings: true,
        }
    },
    {
        id: 2,
        name: 'Cashier',
        permissions: {
            access_dashboard: false,
            access_sales_history: true,
            access_products: false,
            access_inventory: false,
            access_customers: true,
            access_purchases: false,
            access_delivery: false,
            access_shifts: true,
            access_settings: false,
        }
    }
];

export const users: User[] = [
    { id: 1, name: 'Admin User', pin: '1111', roleId: 1 },
    { id: 2, name: 'Cashier User', pin: '2222', roleId: 2 },
];


export const expenses: Expense[] = [];
export const cashDrawerEntries: CashDrawerEntry[] = [];
export const shifts: Shift[] = [];
