"use client";

import * as React from "react";
import {
  Bot,
  Languages,
  PlusCircle,
  ShoppingBag,
  History,
} from "lucide-react";

import type { CartItem, Product, Sale } from "@/lib/types";
import { products as initialProducts } from "@/lib/data";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/pos/Header";
import ProductGrid from "@/components/pos/ProductGrid";
import CartPanel from "@/components/pos/CartPanel";
import PaymentDialog from "@/components/pos/PaymentDialog";
import SmartRoundupDialog from "@/components/pos/SmartRoundupDialog";
import SalesHistoryTab from "@/components/pos/SalesHistoryTab";

type Language = "en" | "ar";

const UI_TEXT = {
  sales: { en: "Sales", ar: "المبيعات" },
  salesHistory: { en: "Sales History", ar: "سجل المبيعات" },
  posSystem: { en: "POS System", ar: "نظام نقاط البيع" },
  transactionSuccess: { en: "Transaction successful!", ar: "تمت العملية بنجاح!" },
  transactionSuccessDesc: { en: (id: string) => `Sale ID: ${id}`, ar: (id: string) => `رقم الفاتورة: ${id}`},
  products: { en: "Products", ar: "المنتجات" },
  quickServeLite: { en: "QuickServe Lite", ar: "كويك سيرف لايت" },
};

export default function POSPage() {
  const [language, setLanguage] = React.useState<Language>("ar");
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [products] = React.useState<Product[]>(initialProducts);
  
  const [isPaymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [isSmartRoundupOpen, setSmartRoundupOpen] = React.useState(false);

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
    toast({
      title: UI_TEXT.transactionSuccess[language],
      description: UI_TEXT.transactionSuccessDesc[language](newSale.id),
    });
  };

  return (
    <div className="flex h-screen flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header
        appName={UI_TEXT.quickServeLite[language]}
        language={language}
        setLanguage={setLanguage}
        onOpenSmartRoundup={() => setSmartRoundupOpen(true)}
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <Tabs defaultValue="sales" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sales">
              <ShoppingBag className={language === 'ar' ? "ms-2 h-4 w-4" : "me-2 h-4 w-4"} />
              {UI_TEXT.sales[language]}
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className={language === 'ar' ? "ms-2 h-4 w-4" : "me-2 h-4 w-4"} />
              {UI_TEXT.salesHistory[language]}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="h-full">
            <div className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{UI_TEXT.products[language]}</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-4rem)] overflow-auto">
                    <ProductGrid
                      products={products}
                      onAddToCart={addToCart}
                      language={language}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                 <CartPanel
                    cart={cart}
                    setCart={setCart}
                    clearCart={clearCart}
                    onProcessPayment={() => setPaymentDialogOpen(true)}
                    language={language}
                  />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history">
            <SalesHistoryTab sales={sales} language={language} />
          </TabsContent>
        </Tabs>
      </main>

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
