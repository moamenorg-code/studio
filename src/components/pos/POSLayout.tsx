import * as React from 'react';
import type { ActiveView, Language, Settings, ActiveOrder, CartItem, Customer, DeliveryRep, HeldOrder, Table, Shift, Product, Sale, Supplier, RawMaterial, Recipe, Category, Expense, CashDrawerEntry } from '@/lib/types';
import { UI_TEXT, VIEW_OPTIONS } from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Briefcase, RefreshCcw } from 'lucide-react';
import Header from './Header';
import SalesView from './SalesView';
import DashboardTab from './DashboardTab';
import SalesHistoryTab from './SalesHistoryTab';
import ProductsAndRecipesTab from './ProductsAndRecipesTab';
import InventoryManagementTab from './InventoryManagementTab';
import CustomerManagementTab from './CustomerManagementTab';
import PurchasesAndSuppliersTab from './PurchasesAndSuppliersTab';
import DeliveryRepsTab from './DeliveryRepsTab';
import ShiftsManagementTab from './ShiftsManagementTab';
import TablesManagementTab from './TablesManagementTab';
import SettingsTab from './SettingsTab';
import FloatingCartBar from './FloatingCartBar';
import CartPanel from './CartPanel';
import PaymentDialog from './PaymentDialog';
import SmartRoundupDialog from './SmartRoundupDialog';
import HeldOrdersDialog from './HeldOrdersDialog';
import SplitBillDialog from './SplitBillDialog';
import { products as initialProducts, customers as initialCustomers, suppliers as initialSuppliers, rawMaterials as initialRawMaterials, shifts as initialShifts, expenses as initialExpenses, cashDrawerEntries as initialCashDrawerEntries, recipes as initialRecipes, categories as initialCategories, tables as initialTables, deliveryReps as initialDeliveryReps } from "@/lib/data";
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';


const POSLayout: React.FC = () => {
  const [language, setLanguage] = React.useState<Language>("ar");
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);
  const [deliveryReps, setDeliveryReps] = React.useState<DeliveryRep[]>(initialDeliveryReps);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>(initialSuppliers);
  const [rawMaterials, setRawMaterials] = React.useState<RawMaterial[]>(initialRawMaterials);
  const [recipes, setRecipes] = React.useState<Recipe[]>(initialRecipes);
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [tables, setTables] = React.useState<Table[]>(initialTables);
  const [shifts, setShifts] = React.useState<Shift[]>(initialShifts);
  const [expenses, setExpenses] = React.useState<Expense[]>(initialExpenses);
  const [cashDrawerEntries, setCashDrawerEntries] = React.useState<CashDrawerEntry[]>(initialCashDrawerEntries);
  const [activeView, setActiveView] = React.useState<ActiveView>("shifts");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>("all");
  
  const [isPaymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [paymentCart, setPaymentCart] = React.useState<CartItem[]>([]);
  const [isSmartRoundupOpen, setSmartRoundupOpen] = React.useState(false);
  const [isHeldOrdersOpen, setHeldOrdersOpen] = React.useState(false);
  const [isCartSheetOpen, setCartSheetOpen] = React.useState(false);
  const [isSplitBillOpen, setSplitBillOpen] = React.useState(false);
  
  const [activeOrder, setActiveOrder] = React.useState<ActiveOrder | null>(null);
  const [takeawayOrders, setTakeawayOrders] = React.useState<any[]>([]);
  const [deliveryOrders, setDeliveryOrders] = React.useState<any[]>([]);
  const [heldOrders, setHeldOrders] = React.useState<HeldOrder[]>([]);


  const [settings, setSettings] = React.useState<Settings>({
    storeName: "RMS POS",
    address: "123 Main Street, Riyadh",
    phone: "011-123-4567",
    currency: "SAR",
    taxRate: 15,
    receiptHeader: "Thank you for your business!",
    receiptFooter: "Please come again!",
    enableTables: true,
    deliveryFee: 10,
    printerName: "Default Printer",
    printerConnectionType: "network",
    printerIpAddress: "192.168.1.100",
    printerPaperWidth: "80mm",
  });

  const { toast } = useToast();

  const activeShift = React.useMemo(() => shifts.find(s => s.status === 'open'), [shifts]);

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
    setCartSheetOpen(true); // Open cart to force customer selection
  }

  const clearCart = (isPayment: boolean = false) => {
    if (!activeOrder) return;

    switch (activeOrder.type) {
        case 'dine-in':
            // If it's a payment, we clear the table fully.
            // If it's a cancel/clear action, we also clear it.
            setTables(prev => prev.map(t => t.id === activeOrder.id ? { ...t, cart: [], selectedCustomerId: null } : t));
            break;
        case 'takeaway':
             setTakeawayOrders(prev => prev.filter(o => o.id !== activeOrder.id));
            break;
        case 'delivery':
             setDeliveryOrders(prev => prev.filter(o => o.id !== activeOrder.id));
            break;
    }
    
    // Only deactivate the order if it's not a table being cleared from the cart panel
    if (isPayment || activeOrder.type !== 'dine-in') {
      setActiveOrder(null);
    }
    setCartSheetOpen(false);
  };
  
const handleHoldOrder = () => {
    if (!activeOrder || activeCart.length === 0) return;

    const customer = customers.find(c => c.id === activeCustomerId);
    let orderName: string | undefined;

    if (activeOrder.type === 'dine-in') {
        const table = tables.find(t => t.id === activeOrder.id);
        orderName = customer ? `${table?.name} - ${customer.name}` : table?.name;
    } else {
        orderName = customer?.name || (activeOrder.type === 'takeaway' ? `Takeaway #${Date.now() % 1000}` : `Delivery #${Date.now() % 1000}`);
    }

    const newHeldOrder: HeldOrder = {
        id: Date.now(),
        name: orderName || `Order #${activeOrder.id}`,
        cart: activeCart,
        orderType: activeOrder.type,
        orderId: activeOrder.id,
        selectedCustomerId: activeCustomerId,
        heldAt: new Date(),
    };

    setHeldOrders(prev => [newHeldOrder, ...prev.filter(o => !(o.orderId === newHeldOrder.orderId && o.orderType === newHeldOrder.orderType))]);
    
    // For takeaway or delivery, holding the order means clearing it from the active list.
    // For dine-in, the order remains on the table, but is also available in the held list.
    if (activeOrder.type === 'takeaway') {
        setTakeawayOrders(prev => prev.filter(o => o.id !== activeOrder.id));
        setActiveOrder(null);
    } else if (activeOrder.type === 'delivery') {
        setDeliveryOrders(prev => prev.filter(o => o.id !== activeOrder.id));
        setActiveOrder(null);
    }
    
    setCartSheetOpen(false);
    toast({
        title: UI_TEXT.orderHeld[language],
    });
}


  const handleRestoreOrder = (heldOrder: HeldOrder) => {
    const { orderType, orderId, cart, selectedCustomerId } = heldOrder;
    
    // Data to be restored
    const orderData = { id: orderId, cart, selectedCustomerId };

    // Restore the order to its original source
    if (orderType === 'dine-in') {
        setTables(prev => {
            const tableExists = prev.some(t => t.id === orderId);
            return tableExists ? prev.map(t => t.id === orderId ? { ...t, cart, selectedCustomerId } : t) : prev;
        });
    } else if (orderType === 'takeaway') {
        setTakeawayOrders(prev => [...prev.filter(o => o.id !== orderId), orderData]);
    } else if (orderType === 'delivery') {
        setDeliveryOrders(prev => [...prev.filter(o => o.id !== orderId), orderData]);
    }
    
    setActiveOrder({ type: orderType, id: orderId });
    setHeldOrders(prev => prev.filter(o => o.id !== heldOrder.id));
    setActiveView('sales');
    setHeldOrdersOpen(false);
    setCartSheetOpen(true);
  }

  const handleOpenPaymentDialog = (cartToPay: CartItem[]) => {
    setPaymentCart(cartToPay);
    setPaymentDialogOpen(true);
  };
  
  const handleConfirmPayment = (saleData: Omit<Sale, "id" | "createdAt" | "customer" | "orderType" | "orderId">, paidCart: CartItem[]) => {
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
    
    // Remove paid items from the active cart
    const remainingCart = activeCart.reduce((acc, item) => {
        const paidItem = paidCart.find(p => p.id === item.id);
        if (paidItem) {
            if (item.quantity > paidItem.quantity) {
                acc.push({ ...item, quantity: item.quantity - paidItem.quantity });
            }
        } else {
            acc.push(item);
        }
        return acc;
    }, [] as CartItem[]);
    
    setActiveCart(remainingCart);
    
    // If cart is empty after payment, clear the order
    if (remainingCart.length === 0) {
        setHeldOrders(prev => prev.filter(o => !(o.orderId === activeOrder.id && o.orderType === activeOrder.type)));
        clearCart(true);
    }
    
    setPaymentDialogOpen(false);
    setSplitBillOpen(false); // Close split bill dialog after a partial payment
    
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
  
  const handleDeliveryRepUpdate = (updatedDeliveryReps: DeliveryRep[]) => {
    setDeliveryReps(updatedDeliveryReps);
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
    if (updatedShifts.some(s => s.status === 'open') && !activeShift) {
      setActiveView('sales');
    }
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

    const renderActiveView = () => {
    if (!activeShift && activeView !== 'shifts' && activeView !== 'settings') {
      return (
         <div className="flex h-full items-center justify-center">
            <Alert className="max-w-md text-center">
                <Briefcase className="mx-auto h-8 w-8 mb-4" />
                <AlertTitle>{UI_TEXT.noActiveShift[language]}</AlertTitle>
                <AlertDescription>{UI_TEXT.noActiveShiftDesc[language]}</AlertDescription>
            </Alert>
        </div>
      );
    }
    
    switch(activeView) {
      case 'sales':
        return <SalesView 
                    language={language}
                    activeOrder={activeOrder}
                    filteredProducts={filteredProducts}
                    onAddToCart={addToCart}
                    onNewTakeawayOrder={handleNewTakeawayOrder}
                    onNewDeliveryOrder={handleNewDeliveryOrder}
                    onSetActiveView={setActiveView}
                    tablesEnabled={settings.enableTables}
                />;
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
      case 'deliveryReps':
        return <DeliveryRepsTab
                  reps={deliveryReps}
                  onRepsChange={handleDeliveryRepUpdate}
                  sales={sales}
                  shifts={shifts}
                  language={language}
                  settings={settings}
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
    if (!activeShift || activeView !== 'sales') return false;
    return !!activeOrder && activeCart.length > 0;
  }

  const showSearchBar = () => {
    if (!activeShift) return false;
    return activeView === 'sales' && activeOrder;
  }

  return (
    <div className="flex h-screen flex-col bg-muted/40" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header
        appName={settings.storeName}
        language={language}
        setLanguage={setLanguage}
        onOpenSmartRoundup={() => setSmartRoundupOpen(true)}
        onOpenHeldOrders={() => setHeldOrdersOpen(true)}
        heldOrdersCount={heldOrders.length}
        activeView={activeView}
        setActiveView={setActiveView}
        enableTables={settings.enableTables}
        isShiftOpen={!!activeShift}
      />
      <main className="flex flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6">
        <div className="flex items-center gap-4 shrink-0">
           {showSearchBar() ? (
             <>
                <div className="relative flex-1">
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
                    <SelectTrigger className="w-auto sm:w-[200px]">
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
                 <Button variant="outline" onClick={() => setActiveOrder(null)}>
                    <RefreshCcw className="w-4 h-4 me-2" />
                    {UI_TEXT.switchOrder[language]}
                 </Button>
             </>
           ) : (
            <h1 className="text-xl font-semibold flex-1">
              {UI_TEXT[VIEW_OPTIONS.find(v => v.value === activeView)!.label][language]}
            </h1>
           )}
        </div>

        <div className="flex-1 overflow-auto"> 
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
        clearCart={() => clearCart(false)}
        onProcessPayment={() => handleOpenPaymentDialog(activeCart)}
        onHoldOrder={handleHoldOrder}
        onSplitBill={() => setSplitBillOpen(true)}
        language={language}
        customers={customers}
        selectedCustomerId={activeCustomerId}
        onSelectCustomer={setActiveCustomerId}
        onCustomerUpdate={handleCustomerUpdate}
        orderType={activeOrder?.type}
      />
      
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        cart={paymentCart}
        onConfirm={handleConfirmPayment}
        language={language}
        customers={customers}
        selectedCustomerId={activeCustomerId}
        onSelectCustomer={setActiveCustomerId}
        onCustomerUpdate={handleCustomerUpdate}
        orderType={activeOrder?.type}
        deliveryReps={deliveryReps}
        settings={settings}
      />
      
      <SplitBillDialog
        isOpen={isSplitBillOpen}
        onOpenChange={setSplitBillOpen}
        cart={activeCart}
        onProcessPayment={handleOpenPaymentDialog}
        language={language}
        currency={settings.currency}
      />

      <SmartRoundupDialog
        isOpen={isSmartRoundupOpen}
        onOpenChange={setSmartRoundupOpen}
        language={language}
      />

      <HeldOrdersDialog
        isOpen={isHeldOrdersOpen}
        onOpenChange={setHeldOrdersOpen}
        heldOrders={heldOrders}
        onRestoreOrder={handleRestoreOrder}
        language={language}
      />
    </div>
  );
}

export default POSLayout;
