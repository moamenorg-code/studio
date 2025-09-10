import * as React from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, DocumentData, QueryDocumentSnapshot, writeBatch, doc } from 'firebase/firestore';
import type { ActiveView, Language, Settings, ActiveOrder, CartItem, Customer, DeliveryRep, HeldOrder, Table, Shift, Product, Sale, Supplier, RawMaterial, Recipe, Category, Expense, CashDrawerEntry, User, Role, AppData, FirestoreStatus, Permission, Purchase } from '@/lib/types';
import { UI_TEXT, VIEW_OPTIONS } from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Briefcase, RefreshCcw, ShieldAlert, ScanLine } from 'lucide-react';
import Header from './Header';
import SalesView from './SalesView';
import DashboardTab from './DashboardTab';
import ReportsTab from './ReportsTab';
import ProductsAndRecipesTab from './ProductsAndRecipesTab';
import InventoryManagementTab from './InventoryManagementTab';
import CustomerManagementTab from './CustomerManagementTab';
import PurchasesAndSuppliersTab from './PurchasesAndSuppliersTab';
import DeliveryRepsTab from './DeliveryRepsTab';
import ShiftsManagementTab from './ShiftsManagementTab';
import TablesManagementTab from './tables/TablesManagementTab';
import SettingsTab from './SettingsTab';
import FloatingCartBar from './FloatingCartBar';
import CartPanel from './CartPanel';
import PaymentDialog from './PaymentDialog';
import SmartRoundupDialog from './SmartRoundupDialog';
import HeldOrdersDialog from './HeldOrdersDialog';
import SplitBillDialog from './SplitBillDialog';
import LoginScreen from './LoginScreen';
import BarcodeScanner from './BarcodeScanner';
import { customers as initialCustomers, suppliers as initialSuppliers, rawMaterials as initialRawMaterials, shifts as initialShifts, expenses as initialExpenses, cashDrawerEntries as initialCashDrawerEntries, recipes as initialRecipes, categories as initialCategories, tables as initialTables, deliveryReps as initialDeliveryReps, users as initialUsers, roles as initialRoles, purchases as initialPurchases, sales as initialSales, products as initialProducts } from "@/lib/data";
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';

// Helper function moved outside the component to prevent re-creation on re-renders.
const hasPermission = (permission: Permission, user: User | null, roles: Role[]): boolean => {
    if (!user) return false;
    const userRole = roles.find(r => r.id === user.roleId);
    if (!userRole) return false;
    return userRole.permissions[permission] || false;
};


const POSLayout: React.FC = () => {
  const [language, setLanguage] = React.useState<Language>("ar");
  const [sales, setSales] = React.useState<Sale[]>(initialSales);
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
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [roles, setRoles] = React.useState<Role[]>(initialRoles);
  const [purchases, setPurchases] = React.useState<any[]>(initialPurchases);
  const [firestoreStatus, setFirestoreStatus] = React.useState<FirestoreStatus>('connecting');
  
  const [activeView, setActiveView] = React.useState<ActiveView>("shifts");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>("all");
  
  const [isPaymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [paymentCart, setPaymentCart] = React.useState<CartItem[]>([]);
  const [isSmartRoundupOpen, setSmartRoundupOpen] = React.useState(false);
  const [isHeldOrdersOpen, setHeldOrdersOpen] = React.useState(false);
  const [isCartSheetOpen, setCartSheetOpen] = React.useState(false);
  const [isSplitBillOpen, setSplitBillOpen] = React.useState(false);
  const [isBarcodeScannerOpen, setBarcodeScannerOpen] = React.useState(false);
  const [barcodeScannerCallback, setBarcodeScannerCallback] = React.useState<(barcode: string) => void>(() => () => {});
  
  const [activeOrder, setActiveOrder] = React.useState<ActiveOrder | null>(null);
  type TakeawayOrder = { id: number; cart: CartItem[]; selectedCustomerId: number | null; overallDiscount: number; serviceCharge: number; };
  const [takeawayOrders, setTakeawayOrders] = React.useState<TakeawayOrder[]>([]);
  type DeliveryOrder = { id: number; cart: CartItem[]; selectedCustomerId: number | null; overallDiscount: number; serviceCharge: number; };
  const [deliveryOrders, setDeliveryOrders] = React.useState<DeliveryOrder[]>([]);

  const [heldOrders, setHeldOrders] = React.useState<HeldOrder[]>([]);

  const [currentUser, setCurrentUser] = React.useState<User | null>(null);


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

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), 
    (snapshot) => {
      const productsData = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>),
      }));
      setProducts(productsData);
      setFirestoreStatus('connected');
    },
    (error) => {
      console.error("Firestore snapshot error:", error);
      setFirestoreStatus('error');
    });

    return () => unsubscribe();
  }, []);

  const activeShift = React.useMemo(() => shifts.find(s => s.status === 'open'), [shifts]);

  const getActiveOrderData = React.useCallback(() => {
    if (!activeOrder) return null;
    switch (activeOrder.type) {
        case 'dine-in':
            return tables.find(t => t.id === activeOrder.id);
        case 'takeaway':
            return takeawayOrders.find(o => o.id === activeOrder.id);
        case 'delivery':
            return deliveryOrders.find(o => o.id === activeOrder.id);
        default:
            return null;
    }
  }, [activeOrder, tables, takeawayOrders, deliveryOrders]);


  const activeCart = React.useMemo(() => getActiveOrderData()?.cart || [], [getActiveOrderData]);
  const activeCustomerId = React.useMemo(() => getActiveOrderData()?.selectedCustomerId || null, [getActiveOrderData]);
  const activeOverallDiscount = React.useMemo(() => getActiveOrderData()?.overallDiscount || 0, [getActiveOrderData]);
  const activeServiceCharge = React.useMemo(() => getActiveOrderData()?.serviceCharge || 0, [getActiveOrderData]);

  const setActiveCart = React.useCallback((newCart: CartItem[] | ((prevCart: CartItem[]) => CartItem[])) => {
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
  }, [activeOrder]);
  
  const setActiveCustomerId = React.useCallback((id: number | null) => {
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
  }, [activeOrder]);


    const setOrderProperty = React.useCallback((key: 'overallDiscount' | 'serviceCharge', value: number) => {
        if (!activeOrder) return;
        switch (activeOrder.type) {
            case 'dine-in':
                setTables(prev => prev.map(t => t.id === activeOrder.id ? { ...t, [key]: value } : t));
                break;
            case 'takeaway':
                setTakeawayOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, [key]: value } : o));
                break;
            case 'delivery':
                setDeliveryOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, [key]: value } : o));
                break;
        }
    }, [activeOrder]);
    const setActiveOverallDiscount = React.useCallback((value: number) => setOrderProperty('overallDiscount', value), [setOrderProperty]);
    const setActiveServiceCharge = React.useCallback((value: number) => setOrderProperty('serviceCharge', value), [setOrderProperty]);

  React.useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);
  
  const handleSetActiveView = React.useCallback((view: ActiveView) => {
    const viewOption = VIEW_OPTIONS.find(v => v.value === view);
    if (!currentUser) return; // Should not happen if logged in
    
    if (viewOption?.permission) {
      if (hasPermission(viewOption.permission, currentUser, roles)) {
        setActiveView(view);
      } else {
        setActiveView('unauthorized');
      }
    } else {
      setActiveView(view);
    }
  }, [currentUser, roles]);

  const handleLogin = React.useCallback((pin: string) => {
    const user = users.find(u => u.pin === pin);
    if (user) {
      setCurrentUser(user);
      const canAccessShifts = hasPermission('access_shifts', user, roles);
      setActiveView(canAccessShifts ? 'shifts' : 'sales');
    } else {
      toast({
        title: UI_TEXT.loginFailed[language],
        description: UI_TEXT.loginFailedDesc[language],
        variant: "destructive",
      });
    }
  }, [users, roles, language, toast]);
  
  const handleLogout = () => {
      setCurrentUser(null);
      setActiveOrder(null);
      setCartSheetOpen(false);
  }

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
    setTakeawayOrders(prev => [...prev, {id: newOrderId, cart: [], selectedCustomerId: null, overallDiscount: 0, serviceCharge: 0}]);
    setActiveOrder({ type: 'takeaway', id: newOrderId });
    setActiveView('sales');
  }

  const handleNewDeliveryOrder = () => {
    const newOrderId = Date.now();
    setDeliveryOrders(prev => [...prev, {id: newOrderId, cart: [], selectedCustomerId: null, overallDiscount: 0, serviceCharge: settings.deliveryFee}]);
    setActiveOrder({ type: 'delivery', id: newOrderId });
    setActiveView('sales');
    setCartSheetOpen(true); // Open cart to force customer selection
  }

  const clearCart = (isPayment: boolean = false) => {
    if (!activeOrder) return;

    switch (activeOrder.type) {
        case 'dine-in':
             if (isPayment) {
                setTables(prev => prev.map(t => t.id === activeOrder.id ? { ...t, cart: [], selectedCustomerId: null, overallDiscount: 0, serviceCharge: 0 } : t));
             }
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
        overallDiscount: activeOverallDiscount,
        serviceCharge: activeServiceCharge,
    };
    
    const orderAlreadyHeld = heldOrders.some(o => o.orderId === newHeldOrder.orderId && o.orderType === newHeldOrder.orderType);

    if (orderAlreadyHeld) {
      setHeldOrders(prev => prev.map(o => o.orderId === newHeldOrder.orderId && o.orderType === newHeldOrder.orderType ? newHeldOrder : o));
    } else {
      setHeldOrders(prev => [newHeldOrder, ...prev]);
    }
    
    // For dine-in, we keep the table occupied. For others, we clear the active order.
    if (activeOrder.type === 'dine-in') {
        setCartSheetOpen(false);
        setActiveOrder(null);
    } else {
        clearCart();
    }
    
    toast({
        title: UI_TEXT.orderHeld[language],
    });
}


  const handleRestoreOrder = (heldOrder: HeldOrder) => {
    const { orderType, orderId, cart, selectedCustomerId, overallDiscount, serviceCharge } = heldOrder;
    
    // Data to be restored
    const orderData = { id: orderId, cart, selectedCustomerId, overallDiscount, serviceCharge };

    // Restore the order to its original source
    if (orderType === 'dine-in') {
        setTables(prev => prev.map(t => t.id === orderId ? { ...t, ...orderData } : t));
    } else if (orderType === 'takeaway') {
        if (!takeawayOrders.some(o => o.id === orderId)) {
            setTakeawayOrders(prev => [...prev, orderData]);
        }
    } else if (orderType === 'delivery') {
        if (!deliveryOrders.some(o => o.id === orderId)) {
            setDeliveryOrders(prev => [...prev, orderData]);
        }
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
  
  const handleConfirmPayment = (saleData: Omit<Sale, "id" | "createdAt" | "customer" | "orderType" | "orderId" | "userId">, paidCart: CartItem[]) => {
    if (!activeOrder || !currentUser) return;
    
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
      userId: currentUser.id,
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
  
  const handleUsersUpdate = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
  };
  
  const handleRolesUpdate = (updatedRoles: Role[]) => {
    setRoles(updatedRoles);
  };

  const handlePurchasesUpdate = (updatedPurchases: Purchase[]) => {
    setPurchases(updatedPurchases);
  };


  const openBarcodeScanner = (onDetect: (barcode: string) => void) => {
    setBarcodeScannerCallback(() => onDetect);
    setBarcodeScannerOpen(true);
  };

  const handleBarcodeDetect = (barcode: string) => {
    if (barcodeScannerCallback) {
        barcodeScannerCallback(barcode);
    }
    setBarcodeScannerOpen(false);
  }

  const handleRestore = (data: AppData) => {
      setProducts(data.products);
      setCategories(data.categories);
      setCustomers(data.customers);
      setDeliveryReps(data.deliveryReps);
      setExpenses(data.expenses);
      setCashDrawerEntries(data.cashDrawerEntries);
      setPurchases(data.purchases);
      setRawMaterials(data.rawMaterials);
      setRecipes(data.recipes);
      setRoles(data.roles);
      setSales(data.sales);
      setSettings(data.settings);
      setShifts(data.shifts);
      setSuppliers(data.suppliers);
      setTables(data.tables);
      setUsers(data.users);

      // Reset runtime state
      setActiveOrder(null);
      setHeldOrders([]);
      setTakeawayOrders([]);
      setDeliveryOrders([]);
      setCartSheetOpen(false);
      setActiveView('shifts'); // Go to a neutral page

      toast({
          title: 'Restore Successful',
          description: 'Data has been restored successfully. The application will now reload.',
      });

      // Force a reload to ensure all components re-render with new state
      setTimeout(() => window.location.reload(), 1500);
  };

  const getAppData = (): AppData => ({
      products, categories, customers, deliveryReps, expenses, cashDrawerEntries,
      purchases, rawMaterials, recipes, roles, sales, settings, shifts,
      suppliers, tables, users
  });

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

    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} users={users} language={language} />;
    }

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
                    onSetActiveView={handleSetActiveView}
                    tablesEnabled={settings.enableTables}
                />;
      case 'dashboard':
        return <DashboardTab sales={sales} language={language} />;
      case 'reports':
        return (
          <ReportsTab
            sales={sales}
            purchases={purchases}
            expenses={expenses}
            suppliers={suppliers}
            language={language}
          />
        );
      case 'products':
        return <ProductsAndRecipesTab 
                    products={products} 
                    recipes={recipes}
                    onRecipesChange={handleRecipesUpdate}
                    rawMaterials={rawMaterials}
                    categories={categories}
                    onCategoriesChange={handleCategoriesUpdate}
                    language={language} 
                    onOpenBarcodeScanner={openBarcodeScanner}
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
                  purchases={purchases}
                  onPurchasesChange={handlePurchasesUpdate}
                  language={language} 
                  onOpenBarcodeScanner={openBarcodeScanner}
                  products={products}
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
              onOpenCart={() => setCartSheetOpen(true)}
              language={language}
           />
         );
      case 'settings':
        return <SettingsTab 
                  settings={settings} 
                  onSettingsChange={handleSettingsUpdate}
                  users={users}
                  onUsersChange={handleUsersUpdate}
                  roles={roles}
                  onRolesChange={handleRolesUpdate}
                  language={language}
                  getAppData={getAppData}
                  onRestore={handleRestore}
                />;
      case 'unauthorized':
        return (
            <div className="flex h-full items-center justify-center">
                <Alert variant="destructive" className="max-w-md text-center">
                    <ShieldAlert className="mx-auto h-8 w-8 mb-4" />
                    <AlertTitle>{UI_TEXT.unauthorized[language]}</AlertTitle>
                    <AlertDescription>{UI_TEXT.unauthorizedDesc[language]}</AlertDescription>
                </Alert>
            </div>
        );
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
        onLogout={handleLogout}
        heldOrdersCount={heldOrders.length}
        activeView={activeView}
        setActiveView={handleSetActiveView}
        enableTables={settings.enableTables}
        isShiftOpen={!!activeShift}
        hasPermission={(p) => hasPermission(p, currentUser, roles)}
        firestoreStatus={firestoreStatus}
      />
      <main className="flex flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6">
        <div className="flex items-center gap-4 shrink-0">
           {showSearchBar() ? (
             <>
                <div className="relative flex-1">
                    <Search className={`absolute ${language === 'ar' ? 'right-10' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
                    <Input
                    placeholder={UI_TEXT.searchPlaceholder[language]}
                    className={`${language === 'ar' ? 'pr-16' : 'pl-10'} text-base`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    />
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openBarcodeScanner(setSearchQuery)} 
                        className={`absolute ${language === 'ar' ? 'right-2' : 'left-auto right-2'} top-1/2 -translate-y-1/2 h-8 w-8`}
                        aria-label="Scan Barcode"
                      >
                        <ScanLine className="h-5 w-5" />
                    </Button>
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
              {UI_TEXT[VIEW_OPTIONS.find(v => v.value === activeView)?.label || 'unauthorized']?.[language]}
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
        overallDiscount={activeOverallDiscount}
        serviceCharge={activeServiceCharge}
        setOverallDiscount={setActiveOverallDiscount}
        setServiceCharge={setActiveServiceCharge}
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
        overallDiscount={activeOverallDiscount}
        serviceCharge={activeServiceCharge}
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
      <BarcodeScanner
        isOpen={isBarcodeScannerOpen}
        onOpenChange={setBarcodeScannerOpen}
        onDetect={handleBarcodeDetect}
        language={language}
      />
    </div>
  );
}

export default POSLayout;
