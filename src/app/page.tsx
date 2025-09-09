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
  Settings as SettingsIcon,
  BookCopy,
} from "lucide-react";

import type { CartItem, Product, Sale, Customer, Supplier, RawMaterial, Shift, Expense, CashDrawerEntry, Settings, Recipe } from "@/lib/types";
import { products as initialProducts, customers as initialCustomers, suppliers as initialSuppliers, rawMaterials as initialRawMaterials, shifts as initialShifts, expenses as initialExpenses, cashDrawerEntries as initialCashDrawerEntries, recipes as initialRecipes } from "@/lib/data";

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
import ProductsAndRecipesTab from "@/components/pos/ProductsAndRecipesTab";
import CustomerManagementTab from "@/components/pos/CustomerManagementTab";
import PurchasesAndSuppliersTab from "@/components/pos/PurchasesAndSuppliersTab";
import InventoryManagementTab from "@/components/pos/InventoryManagementTab";
import FloatingCartBar from "@/components/pos/FloatingCartBar";
import ShiftsManagementTab from "@/components/pos/ShiftsManagementTab";
import SettingsTab from "@/components/pos/SettingsTab";


type Language = "en" | "ar";
type ActiveView = "sales" | "dashboard" | "history" | "products" | "customers" | "purchases" | "inventory" | "shifts" | "settings";

const UI_TEXT = {
  sales: { en: "Sales", ar: "المبيعات" },
  salesHistory: { en: "Sales History", ar: "سجل المبيعات" },
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  products: { en: "Products", ar: "المنتجات" },
  productsAndRecipes: { en: "Products & Recipes", ar: "المنتجات والوصفات" },
  customers: { en: "Customers", ar: "العملاء" },
  purchases: { en: "Purchases & Suppliers", ar: "المشتريات والموردين" },
  inventory: { en: "Inventory", ar: "المخزون" },
  shifts: { en: "Shifts & Cash", ar: "الشفتات والخزينة" },
  expenses: { en: "Expenses", ar: "المصروفات" },
  cashDrawer: { en: "Cash Drawer", ar: "الخزينة" },
  settings: { en: "Settings", ar: "الإعدادات" },
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
    { value: 'products', label: 'productsAndRecipes', icon: ClipboardList },
    { value: 'inventory', label: 'inventory', icon: Archive },
    { value: 'customers', label: 'customers', icon: Users },
    { value: 'purchases', label: 'purchases', icon: Truck },
    { value: 'shifts', label: 'shifts', icon: Briefcase },
    { value: 'settings', label: 'settings', icon: SettingsIcon },
];

export default function POSPage() {
  const [language, setLanguage] = React.useState<Language>("ar");
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>(initialSuppliers);
  const [rawMaterials, setRawMaterials] = React.useState<RawMaterial[]>(initialRawMaterials);
  const [recipes, setRecipes] = React.useState<Recipe[]>(initialRecipes);
  const [shifts, setShifts] = React.useState<Shift[]>(initialShifts);
  const [expenses, setExpenses] = React.useState<Expense[]>(initialExpenses);
  const [cashDrawerEntries, setCashDrawerEntries] = React.useState<CashDrawerEntry[]>(initialCashDrawerEntries);
  const [activeView, setActiveView] = React.useState<ActiveView>("sales");
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const [isPaymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [isSmartRoundupOpen, setSmartRoundupOpen] = React.useState(false);
  const [isCartSheetOpen, setCartSheetOpen] = React.useState(false);
  
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<number | null>(null);

  const [settings, setSettings] = React.useState<Settings>({
    storeName: "QuickServe Lite",
    address: "123 Main Street, Riyadh",
    phone: "011-123-4567",
    currency: "SAR",
    taxRate: 15,
    receiptHeader: "Thank you for your business!",
    receiptFooter: "Please come again!",
    printerName: "Default Printer",
    printerConnectionType: "network",
    printerIpAddress: "192.168.1.100",
    printerPaperWidth: "80mm",
  });

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
    setSelectedCustomerId(null);
  };

  const handleConfirmPayment = (saleData: Omit<Sale, "id" | "createdAt" | "customer">) => {
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || undefined;
    const newSale: Sale = {
      ...saleData,
      id: `SALE-${Date.now()}`,
      createdAt: new Date(),
      customer: selectedCustomer,
    };
    setSales(prevSales => [newSale, ...prevSales]);

    // Deduct stock from raw materials based on recipes
    const updatedRawMaterials = [...rawMaterials];
    newSale.items.forEach(cartItem => {
        if (cartItem.recipeId) {
            const recipe = recipes.find(r => r.id === cartItem.recipeId);
            if (recipe) {
                recipe.items.forEach(recipeItem => {
                    const materialIndex = updatedRawMaterials.findIndex(m => m.id === recipeItem.rawMaterialId);
                    if (materialIndex !== -1) {
                        updatedRawMaterials[materialIndex].stock -= recipeItem.quantity * cartItem.quantity;
                    }
                });
            }
        }
    });
    setRawMaterials(updatedRawMaterials);

    setCart([]);
    setSelectedCustomerId(null);
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

  const handleRecipesUpdate = (updatedRecipes: Recipe[]) => {
    setRecipes(updatedRecipes);
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

  const handleSettingsUpdate = (updatedSettings: Settings) => {
    setSettings(updatedSettings);
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
          <Card className="shadow-none border-none">
            <CardHeader className="p-4 pt-0">
              <CardTitle>{UI_TEXT.products[language]}</CardTitle>
              <CardDescription>
                  {UI_TEXT[VIEW_OPTIONS.find(v => v.value === activeView)!.label][language]}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
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
        return <ProductsAndRecipesTab 
                    products={products} 
                    onProductsChange={handleProductUpdate} 
                    recipes={recipes}
                    onRecipesChange={handleRecipesUpdate}
                    rawMaterials={rawMaterials}
                    language={language} 
               />;
      case 'inventory':
        return <InventoryManagementTab rawMaterials={rawMaterials} onRawMaterialsChange={handleRawMaterialUpdate} language={language} />;
      case 'customers':
        return <CustomerManagementTab customers={customers} onCustomersChange={handleCustomerUpdate} language={language} />;
      case 'purchases':
        return <PurchasesAndSuppliersTab 
                  suppliers={suppliers} 
                  onSuppliersChange={handleSupplierUpdate} 
                  rawMaterials={rawMaterials} 
                  onRawMaterialsChange={handleRawMaterialUpdate}
                  language={language} 
               />;
      case 'shifts':
        return (
          <ShiftsManagementTab
            shifts={shifts}
            onShiftsChange={handleShiftsUpdate}
            sales={sales}
            expenses={expenses}
            onExpensesChange={handleExpensesUpdate}
            cashDrawerEntries={cashDrawerEntries}
            onCashDrawerChange={handleCashDrawerUpdate}
            language={language}
          />
        );
      case 'settings':
        return <SettingsTab settings={settings} onSettingsChange={handleSettingsUpdate} language={language} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-muted/40" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header
        appName={settings.storeName}
        language={language}
        setLanguage={setLanguage}
        onOpenSmartRoundup={() => setSmartRoundupOpen(true)}
      />
      <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 sm:p-6">
        <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{UI_TEXT.menu[language]}</span>
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
        customers={customers}
        selectedCustomerId={selectedCustomerId}
        onSelectCustomer={setSelectedCustomerId}
        onCustomerUpdate={handleCustomerUpdate}
      />
      
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        cart={cart}
        onConfirm={handleConfirmPayment}
        language={language}
        customers={customers}
        selectedCustomerId={selectedCustomerId}
        onSelectCustomer={setSelectedCustomerId}
        onCustomerUpdate={handleCustomerUpdate}
      />
      
      <SmartRoundupDialog
        isOpen={isSmartRoundupOpen}
        onOpenChange={setSmartRoundupOpen}
        language={language}
      />
    </div>
  );
}
