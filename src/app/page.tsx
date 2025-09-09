"use client";

import * as React from "react";
import {
  Bot,
  Languages,
  PlusCircle,
  ShoppingBag,
  History,
  ClipboardList,
  AreaChart,
  Users,
  Building,
  Truck,
  Archive,
  Search,
  Menu,
  Briefcase,
  Wallet,
  Receipt,
} from "lucide-react";

import type { CartItem, Product, Sale, Customer, Supplier, RawMaterial, Shift, Expense, CashDrawerEntry } from "@/lib/types";
import { products as initialProducts, customers as initialCustomers, suppliers as initialSuppliers, rawMaterials as initialRawMaterials, shifts as initialShifts, expenses as initialExpenses, cashDrawerEntries as initialCashDrawerEntries } from "@/lib/data";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/pos/Header";
import ProductGrid from "@/components/pos/ProductGrid";
import CartPanel from "@/components/pos/CartPanel";
import PaymentDialog from "@/components/pos/PaymentDialog";
import SmartRoundupDialog from "@/components/pos/SmartRoundupDialog";
import SalesHistoryTab from "@/components/pos/SalesHistoryTab";
import DashboardTab from "@/components/pos/DashboardTab";
import ProductManagementTab from "@/components/pos/ProductManagementTab";
import CustomerManagementTab from "@/components/pos/CustomerManagementTab";
import SupplierManagementTab from "@/components/pos/SupplierManagementTab";
import PurchaseManagementTab from "@/components/pos/PurchaseManagementTab";
import InventoryManagementTab from "@/components/pos/InventoryManagementTab";
import FloatingCartBar from "@/components/pos/FloatingCartBar";
import ShiftsManagementTab from "@/components/pos/ShiftsManagementTab";
import ExpensesTab from "@/components/pos/ExpensesTab";
import CashDrawerTab from "@/components/pos/CashDrawerTab";


type Language = "en" | "ar";
type ActiveView = "sales" | "dashboard" | "history" | "products" | "customers" | "suppliers" | "purchases" | "inventory" | "shifts" | "expenses" | "cash_drawer";

const UI_TEXT = {
  sales: { en: "Sales", ar: "المبيعات" },
  salesHistory: { en: "Sales History", ar: "سجل المبيعات" },
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  products: { en: "Products", ar: "المنتجات" },
  manageProducts: { en: "Manage Products", ar: "إدارة المنتجات" },
  customers: { en: "Customers", ar: "العملاء" },
  suppliers: { en: "Suppliers", ar: "الموردين" },
  purchases: { en: "Purchases", ar: "المشتريات" },
  inventory: { en: "Inventory", ar: "المخزون" },
  shifts: { en: "Shifts", ar: "الشفتات" },
  expenses: { en: "Expenses", ar: "المصروفات" },
  cashDrawer: { en: "Cash Drawer", ar: "الخزينة" },
  transactionSuccess: { en: "Transaction successful!", ar: "تمت العملية بنجاح!" },
  transactionSuccessDesc: { en: (id: string) => `Sale ID: ${id}`, ar: (id: string) => `رقم الفاتورة: ${id}`},
  quickServeLite: { en: "QuickServe Lite", ar: "كويك سيرف لايت" },
  searchPlaceholder: { en: "Search by name or barcode...", ar: "ابحث بالاسم أو الباركود..." },
  menu: { en: "Menu", ar: "القائمة" },
};

const VIEW_OPTIONS: { value: ActiveView; label: keyof typeof UI_TEXT; icon: React.ElementType }[] = [
    { value: 'sales', label: 'sales', icon: ShoppingBag },
    { value: 'dashboard', label: 'dashboard', icon: AreaChart },
    { value: 'history', label: 'salesHistory', icon: History },
    { value: 'products', label: 'manageProducts', icon: ClipboardList },
    { value: 'inventory', label: 'inventory', icon: Archive },
    { value: 'customers', label: 'customers', icon: Users },
    { value: 'suppliers', label: 'suppliers', icon: Building },
    { value: 'purchases', label: 'purchases', icon: Truck },
    { value: 'shifts', label: 'shifts', icon: Briefcase },
    { value: 'expenses', label: 'expenses', icon: Receipt },
    { value: 'cash_drawer', label: 'cashDrawer', icon: Wallet },
];

export default function POSPage() {
  const [language, setLanguage] = React.useState<Language>("ar");
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>(initialSuppliers);
  const [rawMaterials, setRawMaterials] = React.useState<RawMaterial[]>(initialRawMaterials);
  const [shifts, setShifts] = React.useState<Shift[]>(initialShifts);
  const [expenses, setExpenses] = React.useState<Expense[]>(initialExpenses);
  const [cashDrawerEntries, setCashDrawerEntries] = React.useState<CashDrawerEntry[]>(initialCashDrawerEntries);
  const [activeView, setActiveView] = React.useState<ActiveView>("sales");
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const [isPaymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [isSmartRoundupOpen, setSmartRoundupOpen] = React.useState(false);
  const [isCartSheetOpen, setCartSheetOpen] = React.useState(false);

  const { toast } = useToast();

  React.useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, discount: 0 }];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleConfirmPayment = (saleData: Omit<Sale, "id" | "createdAt">) => {
    const newSale: Sale = {
      ...saleData,
      id: `SALE-${Date.now()}`,
      createdAt: new Date(),
    };
    setSales(prevSales => [newSale, ...prevSales]);
    setCart([]);
    setPaymentDialogOpen(false);
    setCartSheetOpen(false);
    toast({
      title: UI_TEXT.transactionSuccess[language],
      description: UI_TEXT.transactionSuccessDesc[language](newSale.id),
    });
  };

  const handleProductUpdate = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  const handleCustomerUpdate = (updatedCustomers: Customer[]) => {
    setCustomers(updatedCustomers);
  };
  
  const handleSupplierUpdate = (updatedSuppliers: Supplier[]) => {
    setSuppliers(updatedSuppliers);
  };

  const handleRawMaterialUpdate = (updatedRawMaterials: RawMaterial[]) => {
    setRawMaterials(updatedRawMaterials);
  };
  
  const handleShiftsUpdate = (updatedShifts: Shift[]) => {
    setShifts(updatedShifts);
  };

  const handleExpensesUpdate = (updatedExpenses: Expense[]) => {
    setExpenses(updatedExpenses);
  };

  const handleCashDrawerUpdate = (updatedEntries: CashDrawerEntry[]) => {
    setCashDrawerEntries(updatedEntries);
  };

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery) return products;
    const lowercasedQuery = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.nameAr.includes(lowercasedQuery) ||
      (product.barcode && product.barcode.includes(lowercasedQuery))
    );
  }, [products, searchQuery]);

  const renderActiveView = () => {
    switch(activeView) {
      case 'sales':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{UI_TEXT.products[language]}</CardTitle>
              <CardDescription>
                  {UI_TEXT[VIEW_OPTIONS.find(v => v.value === activeView)!.label][language]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductGrid
                products={filteredProducts}
                onAddToCart={addToCart}
                language={language}
              />
            </CardContent>
          </Card>
        );
      case 'dashboard':
        return <DashboardTab sales={sales} language={language} />;
      case 'history':
        return <SalesHistoryTab sales={sales} language={language} />;
      case 'products':
        return <ProductManagementTab products={products} onProductsChange={handleProductUpdate} language={language} />;
      case 'inventory':
        return <InventoryManagementTab rawMaterials={rawMaterials} onRawMaterialsChange={handleRawMaterialUpdate} language={language} />;
      case 'customers':
        return <CustomerManagementTab customers={customers} onCustomersChange={handleCustomerUpdate} language={language} />;
      case 'suppliers':
        return <SupplierManagementTab suppliers={suppliers} onSuppliersChange={handleSupplierUpdate} language={language} />;
      case 'purchases':
        return <PurchaseManagementTab suppliers={suppliers} rawMaterials={rawMaterials} onRawMaterialsChange={handleRawMaterialUpdate} language={language} />;
      case 'shifts':
        return <ShiftsManagementTab shifts={shifts} onShiftsChange={handleShiftsUpdate} language={language} sales={sales} expenses={expenses} />;
      case 'expenses':
        return <ExpensesTab expenses={expenses} onExpensesChange={handleExpensesUpdate} language={language} />;
      case 'cash_drawer':
        return <CashDrawerTab entries={cashDrawerEntries} onEntriesChange={handleCashDrawerUpdate} language={language} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header
        appName={UI_TEXT.quickServeLite[language]}
        language={language}
        setLanguage={setLanguage}
        onOpenSmartRoundup={() => setSmartRoundupOpen(true)}
      />
      <main className="flex flex-1 flex-col overflow-auto p-4 sm:p-6">
        <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex w-full items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-shrink-0">
                    <Menu className={language === 'ar' ? 'ml-2 h-5 w-5' : 'mr-2 h-5 w-5'} />
                    <span>{UI_TEXT.menu[language]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={language === 'ar' ? 'end' : 'start'} className="w-[250px]">
                  <ScrollArea className="h-[400px]">
                    {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => (
                      <DropdownMenuItem key={value} onSelect={() => setActiveView(value)} className="text-base py-2.5">
                        {language === 'en' && <Icon className="mr-3 h-5 w-5" />}
                        <span className="flex-1 text-right">{UI_TEXT[label][language]}</span>
                        {language === 'ar' && <Icon className="ml-3 h-5 w-5" />}
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              {activeView === 'sales' && (
                <div className="relative w-full">
                  <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
                  <Input
                    placeholder={UI_TEXT.searchPlaceholder[language]}
                    className={`${language === 'ar' ? 'pr-10' : 'pl-10'} text-base`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </div>
        </div>

        <div className="flex-1 pb-24 sm:pb-28"> 
          {renderActiveView()}
        </div>
      </main>

      {activeView === 'sales' && cart.length > 0 && (
          <FloatingCartBar 
            cart={cart}
            language={language}
            onOpenCart={() => setCartSheetOpen(true)}
          />
      )}

      <CartPanel
        isOpen={isCartSheetOpen}
        onOpenChange={setCartSheetOpen}
        cart={cart}
        setCart={setCart}
        clearCart={clearCart}
        onProcessPayment={() => setPaymentDialogOpen(true)}
        language={language}
      />
      
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        cart={cart}
        onConfirm={handleConfirmPayment}
        language={language}
      />
      
      <SmartRoundupDialog
        isOpen={isSmartRoundupOpen}
        onOpenChange={setSmartRoundupOpen}
        language={language}
      />
    </div>
  );
}
