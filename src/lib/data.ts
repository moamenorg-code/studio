import type { Product, Customer, Supplier, Purchase, RawMaterial, Expense, Shift, CashDrawerEntry, Recipe, Category, Table, DeliveryRep, Role, User, Sale } from './types';

export const categories: Category[] = [
    { id: 1, name: "Hot Drinks", nameAr: "مشروبات ساخنة" },
    { id: 2, name: "Pastries", nameAr: "معجنات" },
    { id: 3, name: "Cold Drinks", nameAr: "مشروبات باردة" },
    { id: 4, name: "Desserts", nameAr: "حلويات" },
    { id: 5, name: "Sandwiches", nameAr: "ساندويتشات" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Espresso",
    nameAr: "اسبريسو",
    price: 25.00,
    barcode: "860001",
    recipeId: 1,
    categoryId: 1,
  },
  {
    id: "2",
    name: "Latte",
    nameAr: "لاتيه",
    price: 35.50,
    barcode: "860002",
    recipeId: 2,
    categoryId: 1,
  },
  {
    id: "3",
    name: "Croissant",
    nameAr: "كرواسون",
    price: 22.75,
    barcode: "860003",
    recipeId: 3,
    categoryId: 2,
  },
  {
    id: "4",
    name: "Cheesecake",
    nameAr: "تشيز كيك",
    price: 45.00,
    barcode: "860004",
    categoryId: 4,
  },
  {
    id: "5",
    name: "Iced Tea",
    nameAr: "شاي مثلج",
    price: 30.25,
    barcode: "860005",
    categoryId: 3,
  },
  {
    id: "6",
    name: "Muffin",
    nameAr: "مافن",
    price: 28.00,
    barcode: "860006",
    categoryId: 2,
  },
    {
    id: "7",
    name: "Cappuccino",
    nameAr: "كابتشينو",
    price: 32.00,
    barcode: "860007",
    recipeId: 2,
    categoryId: 1,
  },
  {
    id: "8",
    name: "Orange Juice",
    nameAr: "عصير برتقال",
    price: 28.50,
    barcode: "860008",
    categoryId: 3,
  },
  {
    id: "9",
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
    { id: 1, name: 'Coffee Beans', nameAr: 'حبوب البن', unit: 'kg', stock: 50, barcode: 'RM001', cost: 80 },
    { id: 2, name: 'Milk', nameAr: 'حليب', unit: 'liter', stock: 100, barcode: 'RM002', cost: 4 },
    { id: 3, name: 'Sugar', nameAr: 'سكر', unit: 'kg', stock: 200, barcode: 'RM003', cost: 5 },
    { id: 4, name: 'Flour', nameAr: 'دقيق', unit: 'kg', stock: 150, barcode: 'RM004', cost: 3 },
    { id: 5, name: 'Butter', nameAr: 'زبدة', unit: 'kg', stock: 40, barcode: 'RM005', cost: 25 },
    { id: 6, name: 'Eggs', nameAr: 'بيض', unit: 'piece', stock: 300, barcode: 'RM006', cost: 0.5 },
    { id: 7, name: 'Dough', nameAr: 'عجينة', unit: 'piece', stock: 50, barcode: 'RM007', cost: 2 },
];

export const recipes: Recipe[] = [
    { id: 1, name: "Espresso Shot", items: [{ rawMaterialId: 1, quantity: 0.02 }] },
    { id: 2, name: "Steamed Milk", items: [{ rawMaterialId: 1, quantity: 0.02 }, { rawMaterialId: 2, quantity: 0.2 }] },
    { id: 3, name: "Croissant Recipe", items: [{ rawMaterialId: 7, quantity: 1 }] },
];

export const tables: Table[] = [
    { id: 1, name: "T1", cart: [], selectedCustomerId: null, overallDiscount: 0, serviceCharge: 0 },
    { id: 2, name: "T2", cart: [], selectedCustomerId: null, overallDiscount: 0, serviceCharge: 0 },
    { id: 3, name: "T3", cart: [], selectedCustomerId: null, overallDiscount: 0, serviceCharge: 0 },
    { id: 4, name: "T4", cart: [], selectedCustomerId: null, overallDiscount: 0, serviceCharge: 0 },
    { id: 5, name: "T5", cart: [], selectedCustomerId: null, overallDiscount: 0, serviceCharge: 0 },
    { id: 6, name: "T6", cart: [], selectedCustomerId: null, overallDiscount: 0, serviceCharge: 0 },
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
            access_tables: true,
            access_reports: true,
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
            access_tables: true,
            access_reports: false,
        }
    }
];

export const users: User[] = [
    { id: 1, name: 'Admin User', pin: '1111', roleId: 1 },
    { id: 2, name: 'Cashier User', pin: '2222', roleId: 2 },
];


export const sales: Sale[] = [
    {
        id: "SALE-1700000000000",
        items: [{ ...products[0], quantity: 1, discount: 0 }, { ...products[2], quantity: 2, discount: 0 }],
        subtotal: 70.5,
        totalDiscountValue: 0,
        serviceCharge: 0,
        finalTotal: 70.5,
        paymentMethod: "card",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        customer: customers[0],
        orderType: "dine-in",
        orderId: 1,
        userId: 1,
    },
    {
        id: "SALE-1700000001000",
        items: [{ ...products[4], quantity: 1, discount: 0 }],
        subtotal: 30.25,
        totalDiscountValue: 0,
        serviceCharge: 10,
        finalTotal: 40.25,
        paymentMethod: "cash",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        customer: customers[1],
        orderType: "delivery",
        orderId: 101,
        deliveryRepId: 1,
        userId: 2,
    },
     {
        id: "SALE-1700000002000",
        items: [{ ...products[8], quantity: 2, discount: 0 }],
        subtotal: 110.0,
        totalDiscountValue: 11,
        serviceCharge: 0,
        finalTotal: 99.0,
        paymentMethod: "card",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        orderType: "takeaway",
        orderId: 201,
        userId: 1,
    },
    {
        id: "SALE-1700000003000",
        items: [{ ...products[1], quantity: 1, discount: 0 }, { ...products[3], quantity: 1, discount: 0 }],
        subtotal: 80.5,
        totalDiscountValue: 0,
        serviceCharge: 0,
        finalTotal: 80.5,
        paymentMethod: "cash",
        createdAt: new Date(), // Today
        customer: customers[2],
        orderType: "dine-in",
        orderId: 3,
        userId: 2,
    }
];

const shift1Sales = sales.filter(s => new Date(s.createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && new Date(s.createdAt) < new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));
const shift2Sales = sales.filter(s => new Date(s.createdAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));

export const expenses: Expense[] = [
    { id: 1, shiftId: 1, description: "Cleaning Supplies", amount: 150.00, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)},
    { id: 2, shiftId: 2, description: "Printer Paper", amount: 50.00, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)},
];

export const cashDrawerEntries: CashDrawerEntry[] = [
    { id: 1, shiftId: 1, type: 'cash_out', amount: 150.00, reason: "Cleaning Supplies", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)},
    { id: 2, shiftId: 2, type: 'cash_out', amount: 50.00, reason: "Printer Paper", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)},
    { id: 3, shiftId: 2, type: 'cash_in', amount: 500.00, reason: "Owner Deposit", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)},
];

export const shifts: Shift[] = [
    { 
        id: 1,
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        startingCash: 500,
        endingCash: 1200.50,
        totalSales: shift1Sales.reduce((sum, s) => sum + s.finalTotal, 0),
        totalExpenses: 150.00,
        status: 'closed'
    },
     { 
        id: 2,
        startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        endTime: new Date(),
        startingCash: 1200.50,
        endingCash: 2500.00,
        totalSales: shift2Sales.reduce((sum, s) => sum + s.finalTotal, 0),
        totalExpenses: 50.00,
        status: 'closed'
    }
];

export const purchases: Purchase[] = [
    {
        id: "PUR-1700000000000",
        supplierId: 1,
        items: [
            { rawMaterialId: 1, name: 'Coffee Beans', nameAr: 'حبوب البن', quantity: 10, price: 150 },
            { rawMaterialId: 3, name: 'Sugar', nameAr: 'سكر', quantity: 20, price: 10 },
        ],
        total: (10 * 150) + (20 * 10),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    }
];
