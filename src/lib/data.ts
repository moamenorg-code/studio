import type { Product, Customer, Supplier, Purchase, RawMaterial, Expense, Shift, CashDrawerEntry } from './types';

export const products: Product[] = [
  {
    id: 1,
    name: "Espresso",
    nameAr: "اسبريسو",
    price: 25.00,
    barcode: "860001",
  },
  {
    id: 2,
    name: "Latte",
    nameAr: "لاتيه",
    price: 35.50,
    barcode: "860002",
  },
  {
    id: 3,
    name: "Croissant",
    nameAr: "كرواسون",
    price: 22.75,
    barcode: "860003",
  },
  {
    id: 4,
    name: "Cheesecake",
    nameAr: "تشيز كيك",
    price: 45.00,
    barcode: "860004",
  },
  {
    id: 5,
    name: "Iced Tea",
    nameAr: "شاي مثلج",
    price: 30.25,
    barcode: "860005",
  },
  {
    id: 6,
    name: "Muffin",
    nameAr: "مافن",
    price: 28.00,
    barcode: "860006",
  },
    {
    id: 7,
    name: "Cappuccino",
    nameAr: "كابتشينو",
    price: 32.00,
    barcode: "860007",
  },
  {
    id: 8,
    name: "Orange Juice",
    nameAr: "عصير برتقال",
    price: 28.50,
    barcode: "860008",
  },
  {
    id: 9,
    name: "Club Sandwich",
    nameAr: "كلوب سندويتش",
    price: 55.00,
    barcode: "860009",
  },
];

export const customers: Customer[] = [
    { id: 1, name: "Ahmad Mahmoud", phone: "0501234567", address: "Riyadh, Saudi Arabia" },
    { id: 2, name: "Fatima Al-Ali", phone: "0557654321", address: "Jeddah, Saudi Arabia" },
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
];

export const expenses: Expense[] = [];
export const cashDrawerEntries: CashDrawerEntry[] = [];
export const shifts: Shift[] = [];
