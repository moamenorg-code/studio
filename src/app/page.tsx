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
  LayoutGrid,
  Table as TableIcon,
  Zap,
  Package,
  Bike
} from "lucide-react";

import type { CartItem, Product, Sale, Customer, Supplier, RawMaterial, Shift, Expense, CashDrawerEntry, Settings, Recipe, Category, Table, OrderType } from "@/lib/types";
import { products as initialProducts, customers as initialCustomers, suppliers as initialSuppliers, rawMaterials as initialRawMaterials, shifts as initialShifts, expenses as initialExpenses, cashDrawerEntries as initialCashDrawerEntries, recipes as initialRecipes, categories as initialCategories, tables as initialTables } from "@/lib/data";

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
import TablesManagementTab from "@/components/pos/TablesManagementTab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type Language = "en" | "ar";
type ActiveView = "sales" | "dashboard" | "history" | "products" | "customers" | "purchases" | "inventory" | "shifts" | "settings" | "tables";

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
  tables: { en: "Tables", ar: "الطاولات" },
  transactionSuccess: { en: "Transaction successful!", ar: "تمت العملية بنجاح!" },
  transactionSuccessDesc: { en: (id: string) => `Sale ID: ${id}`, ar: (id: string) => `رقم الفاتورة: ${id}`},
  quickServeLite: { en: "RMS POS", ar: "RMS POS" },
  searchPlaceholder: { en: "Search by name or barcode...", ar: "ابحث بالاسم أو الباركود..." },
  menu: { en: "Menu", ar: "القائمة" },
  allCategories: { en: 'All Categories', ar: 'كل الفئات' },
  selectCategory: { en: 'Select a category', ar: 'اختر فئة' },
  selectOrderTypePrompt: { en: 'Select an Order Type', ar: 'اختر نوع الطلب' },
  selectOrderTypePromptDesc: { en: 'Please select an order type to begin.', ar: 'يرجى اختيار نوع الطلب للبدء.' },
  quickServe: { en: "Quick Serve", ar: "خدمة سريعة" },
  dineIn: { en: "Dine-in", ar: "طاولات" },
  takeaway: { en: "Takeaway", ar: "سفري" },
  delivery: { en: "Delivery", ar: "توصيل" },
  customerRequired: { en: 'Customer Required', ar: 'العميل مطلوب' },
  customerRequiredDesc: { en: 'Please select or add a customer for this delivery order.', ar: 'يرجى اختيار أو إضافة عميل لطلب التوصيل هذا.' },
};

const VIEW_OPTIONS: { value: ActiveView; label: keyof typeof UI_TEXT; icon: React.ElementType }[] = [
    { value: 'sales', label: 'sales', icon: ShoppingBag },
    { value: 'dashboard', label: 'dashboard', icon: AreaChart },
    { value: 'history', label: 'salesHistory', icon: History },
    { value: 'products', label: 'productsAndRecipes', icon: ClipboardList },
    { value: 'inventory', label: 'inventory', icon: Archive },
    { value: 'tables', label: 'tables', icon: TableIcon },
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
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [tables, setTables] = React.useState<Table[]>(initialTables);
  const [shifts, setShifts] = React.useState<Shift[]>(initialShifts);
  const [expenses, setExpenses] = React.useState<Expense[]>(initialExpenses);
  const [cashDrawerEntries, setCashDrawerEntries] = React.useState<CashDrawerEntry[]>(initialCashDrawerEntries);
  const [activeView, setActiveView] = React.useState<ActiveView>("sales");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>("all");
  
  const [isPaymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [isSmartRoundupOpen, setSmartRoundupOpen] = React.useState(false);
  const [isCartSheetOpen, setCartSheetOpen] = React.useState(false);
  
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<number | null>(null);

  const [activeOrder, setActiveOrder] = React.useState<{ type: OrderType; id: number } | null>(null);
  const [takeawayOrders, setTakeawayOrders] = React.useState<any[]>([]);
  const [deliveryOrders, setDeliveryOrders] = React.useState<any[]>([]);


  const [settings, setSettings] = React.useState<Settings>({
    storeName: "RMS POS",
    address: "123 Main Street, Riyadh",
    phone: "011-123-4567",
    currency: "SAR",
    taxRate: 15,
    receiptHeader: "Thank you for your business!",
    receiptFooter: "Please come again!",
    enableTables: true,
    printerName: "Default Printer",
    printerConnectionType: "network",
    printerIpAddress: "192.168.1.100",
    printerPaperWidth: "80mm",
  });

  const { toast } = useToast();

  const activeCart = React.useMemo(() => {
    if (!activeOrder) return [];
    switch (activeOrder.type) {
        case 'dine-in':
            return tables.find(t => t.id === activeOrder.id)?.cart || [];
        case 'takeaway':
            return takeawayOrders.find(o => o.id === activeOrder.id)?.cart || [];
        case 'delivery':
            return deliveryOrders.find(o => o.id === activeOrder.id)?.cart || [];
        default:
            return [];
    }
  }, [tables, takeawayOrders, deliveryOrders, activeOrder]);

  const activeCustomerId = React.useMemo(() => {
    if (!activeOrder) return null;
     switch (activeOrder.type) {
        case 'dine-in':
            return tables.find(t => t.id === activeOrder.id)?.selectedCustomerId || null;
        case 'takeaway':
            return takeawayOrders.find(o => o.id === activeOrder.id)?.selectedCustomerId || null;
        case 'delivery':
            return deliveryOrders.find(o => o.id === activeOrder.id)?.selectedCustomerId || null;
        default:
            return null;
    }
  }, [tables, takeawayOrders, deliveryOrders, activeOrder]);


  const setActiveCart = (newCart: CartItem[] | ((prevCart: CartItem[]) => CartItem[])) => {
    if (!activeOrder) return;
    const updater = (prevCart: CartItem[]) => typeof newCart === 'function' ? newCart(prevCart) : newCart;

    switch (activeOrder.type) {
        case 'dine-in':
            setTables(prev => prev.map(t => t.id === activeOrder.id ? { ...t, cart: updater(t.cart || []) } : t));
            break;
        case 'takeaway':
            setTakeawayOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, cart: updater(o.cart || []) } : o));
            break;
        case 'delivery':
            setDeliveryOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, cart: updater(o.cart || []) } : o));
            break;
    }
  };
  
  const setActiveCustomerId = (id: number | null) => {
    if (!activeOrder) return;
     switch (activeOrder.type) {
        case 'dine-in':
            setTables(prev => prev.map(t => t.id === activeOrder.id ? { ...t, selectedCustomerId: id } : t));
            break;
        case 'takeaway':
            setTakeawayOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, selectedCustomerId: id } : o));
            break;
        case 'delivery':
            setDeliveryOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, selectedCustomerId: id } : o));
            break;
    }
  };


  React.useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const addToCart = (product: Product) => {
    if (!activeOrder) {
         toast({
            title: UI_TEXT.selectOrderTypePrompt[language],
            description: UI_TEXT.selectOrderTypePromptDesc[language],
            variant: "destructive"
        });
        return;
    }

    const updater = (prevCart: CartItem[]) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, discount: 0 }];
    };
    
    setActiveCart(updater);
  };

  const handleSelectTable = (id: number) => {
    setActiveOrder({ type: 'dine-in', id });
    setActiveView('sales');
  }

  const handleNewTakeawayOrder = () => {
    const newOrderId = Date.now();
    setTakeawayOrders(prev => [...prev, {id: newOrderId, cart: [], selectedCustomerId: null}]);
    setActiveOrder({ type: 'takeaway', id: newOrderId });
  }

  const handleNewDeliveryOrder = () => {
    const newOrderId = Date.now();
    setDeliveryOrders(prev => [...prev, {id: newOrderId, cart: [], selectedCustomerId: null}]);
    setActiveOrder({ type: 'delivery', id: newOrderId });
    setPaymentDialogOpen(true); // Force customer selection
  }

  const clearCart = () => {
    if (!activeOrder) return;
    
    const clearOrder = (order: any) => ({ ...order, cart: [], selectedCustomerId: null });

    switch (activeOrder.type) {
        case 'dine-in':
            setTables(prev => prev.map(t => t.id === activeOrder.id ? clearOrder(t) : t));
            break;
        case 'takeaway':
             setTakeawayOrders(prev => prev.filter(o => o.id !== activeOrder.id));
            break;
        case 'delivery':
             setDeliveryOrders(prev => prev.filter(o => o.id !== activeOrder.id));
            break;
    }
    setActiveOrder(null);
  };

  const handleConfirmPayment = (saleData: Omit<Sale, "id" | "createdAt" | "customer" | "orderType" | "orderId">) => {
    if (!activeOrder) return;
    
    const customer = customers.find(c => c.id === activeCustomerId) || undefined;
    
     if (activeOrder.type === 'delivery' && !customer) {
        toast({
            title: UI_TEXT.customerRequired[language],
            description: UI_TEXT.customerRequiredDesc[language],
            variant: "destructive"
        });
        setPaymentDialogOpen(true);
        return;
    }
    
    const newSale: Sale = {
      ...saleData,
      id: `SALE-${Date.now()}`,
      createdAt: new Date(),
      customer,
      orderType: activeOrder.type,
      orderId: activeOrder.id,
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
    
    clearCart();
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

  const handleCategoriesUpdate = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };
  
  const handleTablesUpdate = (updatedTables: Table[]) => {
    setTables(updatedTables);
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
    return products
      .filter(product => 
        selectedCategoryId === "all" || String(product.categoryId) === selectedCategoryId
      )
      .filter(product => {
        if (!searchQuery) return true;
        const lowercasedQuery = searchQuery.toLowerCase();
        return product.name.toLowerCase().includes(lowercasedQuery) ||
               product.nameAr.includes(lowercasedQuery) ||
               (product.barcode && product.barcode.includes(lowercasedQuery));
      });
  }, [products, searchQuery, selectedCategoryId]);

  const renderSalesContent = () => {
    if (!activeOrder) {
       return (
         <div className="flex items-center justify-center h-full">
            <Alert className="w-auto">
                <ShoppingBag className="h-4 w-4" />
                <AlertTitle>{UI_TEXT.selectOrderTypePrompt[language]}</AlertTitle>
                <AlertDescription>{UI_TEXT.selectOrderTypePromptDesc[language]}</AlertDescription>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Button onClick={() => setActiveView('tables')} className="w-full sm:w-auto">
                        <TableIcon className="w-4 h-4 me-2"/>
                        {UI_TEXT.dineIn[language]}
                    </Button>
                    <Button variant="secondary" onClick={handleNewTakeawayOrder} className="w-full sm:w-auto">
                        <Package className="w-4 h-4 me-2"/>
                        {UI_TEXT.takeaway[language]}
                    </Button>
                    <Button variant="secondary" onClick={handleNewDeliveryOrder} className="w-full sm:w-auto">
                        <Bike className="w-4 h-4 me-2"/>
                        {UI_TEXT.delivery[language]}
                    </Button>
                </div>
            </Alert>
         </div>
       );
    }
    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center gap-4">
                  <div className="flex w-full gap-4">
                    <div className="relative w-full">
                        <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
                        <Input
                        placeholder={UI_TEXT.searchPlaceholder[language]}
                        className={`${language === 'ar' ? 'pr-10' : 'pl-10'} text-base`}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select 
                      onValueChange={setSelectedCategoryId} 
                      value={selectedCategoryId}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder={UI_TEXT.selectCategory[language]} />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-48">
                            <SelectItem value="all">{UI_TEXT.allCategories[language]}</SelectItem>
                            {categories.map(c => (
                                <SelectItem key={c.id} value={String(c.id)}>{language === 'ar' ? c.nameAr : c.name}</SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                    </Select>
                  </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <ProductGrid
                      products={filteredProducts}
                      onAddToCart={addToCart}
                      language={language}
                    />
                  </div>
                </ScrollArea>
            </div>
        </div>
    );
  }


  const renderActiveView = () => {
    switch(activeView) {
      case 'sales':
        return renderSalesContent();
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
                    categories={categories}
                    onCategoriesChange={handleCategoriesUpdate}
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
      case 'tables':
         return (
          <TablesManagementTab 
              tables={tables}
              onTablesChange={handleTablesUpdate}
              activeTableId={activeOrder?.type === 'dine-in' ? activeOrder.id : null}
              onSelectTable={handleSelectTable}
              isFullScreen={true}
              language={language}
              onOpenCart={() => setCartSheetOpen(true)}
           />
         );
      case 'settings':
        return <SettingsTab settings={settings} onSettingsChange={handleSettingsUpdate} language={language} />;
      default:
        return null;
    }
  };
  
  const showFloatingCart = () => {
    if (activeView !== 'sales') return false;
    return !!activeOrder && activeCart.length > 0;
  }

  return (
    <div className="flex h-screen flex-col bg-muted/40" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header
        appName={settings.storeName}
        language={language}
        setLanguage={setLanguage}
        onOpenSmartRoundup={() => setSmartRoundupOpen(true)}
      />
      <main className="flex flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6">
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
                  {VIEW_OPTIONS.filter(v => v.value !== 'tables' || settings.enableTables).map(({ value, label, icon: Icon }) => (
                    <DropdownMenuItem key={value} onSelect={() => setActiveView(value)} className="text-base py-2.5">
                      {language === 'en' && <Icon className="mr-3 h-5 w-5" />}
                      <span className="flex-1 text-right">{UI_TEXT[label][language]}</span>
                      {language === 'ar' && <Icon className="ml-3 h-5 w-5" />}
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            <h1 className="text-xl font-semibold flex-1 text-right">
              {UI_TEXT[VIEW_OPTIONS.find(v => v.value === activeView)!.label][language]}
            </h1>
        </div>

        <div className="flex-1 overflow-hidden pb-24 sm:pb-28"> 
          {renderActiveView()}
        </div>
      </main>

      {showFloatingCart() && (
          <FloatingCartBar 
            cart={activeCart}
            language={language}
            onOpenCart={() => setCartSheetOpen(true)}
          />
      )}

      <CartPanel
        isOpen={isCartSheetOpen}
        onOpenChange={setCartSheetOpen}
        cart={activeCart}
        setCart={setActiveCart}
        clearCart={clearCart}
        onProcessPayment={() => setPaymentDialogOpen(true)}
        language={language}
        customers={customers}
        selectedCustomerId={activeCustomerId}
        onSelectCustomer={setActiveCustomerId}
        onCustomerUpdate={handleCustomerUpdate}
      />
      
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        cart={activeCart}
        onConfirm={handleConfirmPayment}
        language={language}
        customers={customers}
        selectedCustomerId={activeCustomerId}
        onSelectCustomer={setActiveCustomerId}
        onCustomerUpdate={handleCustomerUpdate}
        orderType={activeOrder?.type}
      />
      
      <SmartRoundupDialog
        isOpen={isSmartRoundupOpen}
        onOpenChange={setSmartRoundupOpen}
        language={language}
      />
    </div>
  );
}
