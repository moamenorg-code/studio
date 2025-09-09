import * as React from 'react';
import type { CartItem, Sale, Customer, OrderType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { CreditCard, Wallet } from 'lucide-react';

type Language = 'en' | 'ar';

const UI_TEXT = {
    payment: { en: 'Payment', ar: 'الدفع' },
    totalAmountDue: { en: 'Total amount due:', ar: 'المبلغ الإجمالي المستحق:' },
    selectPayment: { en: 'Select Payment Method', ar: 'اختر طريقة الدفع' },
    cash: { en: 'Cash', ar: 'نقدي' },
    card: { en: 'Card', ar: 'بطاقة' },
    confirmPayment: { en: 'Confirm Payment', ar: 'تأكيد الدفع' },
};

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onConfirm: (saleData: Omit<Sale, "id" | "createdAt" | "customer" | "orderType" | "orderId">) => void;
  language: Language;
  customers: Customer[];
  selectedCustomerId: number | null;
  onSelectCustomer: (id: number | null) => void;
  onCustomerUpdate: (customers: Customer[]) => void;
  orderType?: OrderType;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ 
    isOpen, 
    onOpenChange, 
    cart, 
    onConfirm, 
    language
 }) => {
  const [overallDiscount] = React.useState(0);
  const [serviceCharge] = React.useState(0);

  const subtotal = React.useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  
  const totalDiscountValue = React.useMemo(() => {
    const itemDiscounts = cart.reduce((acc, item) => acc + (item.price * item.quantity * (item.discount / 100)), 0);
    const overallDiscountValue = subtotal * (overallDiscount / 100);
    return itemDiscounts + overallDiscountValue;
  }, [cart, subtotal, overallDiscount]);
  
  const finalTotal = React.useMemo(() => subtotal - totalDiscountValue + serviceCharge, [subtotal, totalDiscountValue, serviceCharge]);
  
  const handlePayment = (paymentMethod: 'cash' | 'card') => {
    if (cart.length === 0) return;
    onConfirm({
      items: cart,
      subtotal,
      totalDiscountValue,
      serviceCharge,
      finalTotal,
      paymentMethod,
    });
  };

  if (!isOpen) return null;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.payment[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.selectPayment[language]}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="my-6 text-center">
              <p className="text-sm text-muted-foreground">{UI_TEXT.totalAmountDue[language]}</p>
              <p className="text-4xl font-bold text-primary">{finalTotal.toFixed(2)}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
              <Button size="lg" onClick={() => handlePayment('cash')} className="bg-green-600 text-white hover:bg-green-700">
                  <Wallet className={language === 'ar' ? "ml-2 h-5 w-5" : "mr-2 h-5 w-5"} />
                  {UI_TEXT.cash[language]}
              </Button>
              <Button size="lg" onClick={() => handlePayment('card')}>
                  <CreditCard className={language === 'ar' ? "ml-2 h-5 w-5" : "mr-2 h-5 w-5"} />
                  {UI_TEXT.card[language]}
              </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default PaymentDialog;
