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
  ChevronDown,
  Users,
  Building,
  Truck,
  Archive,
  Search,
  Menu,
} from "lucide-react";

import type { CartItem, Product, Sale, Customer, Supplier, RawMaterial } from "@/lib/types";
import { products as initialProducts, customers as initialCustomers, suppliers as initialSuppliers, rawMaterials as initialRawMaterials } from "@/lib/data";

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


type Language = "en" | "ar";
type ActiveView = "sales" | "dashboard" | "history" | "products" | "customers" | "suppliers" | "purchases" | "inventory";

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
  transactionSuccess: { en: "Transaction successful!", ar: "تمت العملية بنجاح!" },
  transactionSuccessDesc: { en: (id: string) => `Sale ID: ${id}`, ar: (id: string) => `رقم الفاتورة: ${id}`},
  quickServeLite: { en: "QuickServe Lite", ar: "كويك سيرف لايت" },
  view: { en: "View", ar: "عرض" },
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
];

export default function POSPage() {
  const [language, setLanguage] = React.useState<Language>("ar");
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>(initialSuppliers);
  const [rawMaterials, setRawMaterials] = React.useState<RawMaterial[]>(initialRawMaterials);
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
  
  const ActiveViewIcon = VIEW_OPTIONS.find(v => v.value === activeView)?.icon || ShoppingBag;

  const subtotal = React.useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery) return products;
    const lowercasedQuery = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.nameAr.includes(lowercasedQuery) ||
      (product.barcode && product.barcode.includes(lowercasedQuery))
    );
  }, [products, searchQuery]);


  return (
    <div className="flex h-screen flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header
        appName={UI_TEXT.quickServeLite[language]}
        language={language}
        setLanguage={setLanguage}
        onOpenSmartRoundup={() => setSmartRoundupOpen(true)}
      />
      <main className="flex flex-1 flex-col overflow-auto p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-auto">
                  <Menu className={language === 'ar' ? 'ml-2 h-5 w-5' : 'mr-2 h-5 w-5'} />
                  <span>{UI_TEXT.menu[language]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={language === 'ar' ? 'end' : 'start'} className="w-[250px]">
                {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <DropdownMenuItem key={value} onSelect={() => setActiveView(value)} className="text-base py-2.5">
                    {language === 'en' && <Icon className="mr-3 h-5 w-5" />}
                    <span className="flex-1 text-right">{UI_TEXT[label][language]}</span>
                    {language === 'ar' && <Icon className="mr-3 h-5 w-5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {activeView === 'sales' && (
              <div className="relative w-full">
                <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
                <Input
                  placeholder={UI_TEXT.searchPlaceholder[language]}
                  className={`${language === 'ar' ? 'pr-10' : 'pl-10'} h-full text-base py-2.5`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            )}
        </div>

        <div className="flex-1 pb-20"> {/* Add padding to bottom to avoid overlap with floating bar */}
          {activeView === 'sales' && (
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
          )}

          {activeView === 'dashboard' && <DashboardTab sales={sales} language={language} />}
          {activeView === 'history' && <SalesHistoryTab sales={sales} language={language} />}
          {activeView === 'products' && (
            <ProductManagementTab 
              products={products}
              onProductsChange={handleProductUpdate}
              language={language} 
            />
          )}
          {activeView === 'inventory' && (
            <InventoryManagementTab
              rawMaterials={rawMaterials}
              onRawMaterialsChange={handleRawMaterialUpdate}
              language={language}
            />
          )}
          {activeView === 'customers' && (
            <CustomerManagementTab
              customers={customers}
              onCustomersChange={handleCustomerUpdate}
              language={language}
            />
          )}
          {activeView === 'suppliers' && (
            <SupplierManagementTab
              suppliers={suppliers}
              onSuppliersChange={handleSupplierUpdate}
              language={language}
            />
          )}
          {activeView === 'purchases' && (
            <PurchaseManagementTab
              suppliers={suppliers}
              language={language}
            />
          )}
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
