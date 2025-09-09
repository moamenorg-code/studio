import * as React from 'react';
import type { CartItem, Sale, Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { CreditCard, Wallet, UserPlus } from 'lucide-react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Language = 'en' | 'ar';

const UI_TEXT = {
    payment: { en: 'Payment', ar: 'الدفع' },
    totalAmountDue: { en: 'Total amount due:', ar: 'المبلغ الإجمالي المستحق:' },
    selectPayment: { en: 'Select Payment Method', ar: 'اختر طريقة الدفع' },
    cash: { en: 'Cash', ar: 'نقدي' },
    card: { en: 'Card', ar: 'بطاقة' },
    customer: { en: 'Customer', ar: 'العميل' },
    selectCustomer: { en: 'Select a customer', ar: 'اختر عميل' },
    walkInCustomer: { en: 'Walk-in Customer', ar: 'عميل عابر' },
};

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onConfirm: (saleData: Omit<Sale, "id" | "createdAt" | "customer">) => void;
  language: Language;
  customers: Customer[];
  selectedCustomerId: number | null;
  onSelectCustomer: (id: number | null) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ 
    isOpen, 
    onOpenChange, 
    cart, 
    onConfirm, 
    language,
    customers,
    selectedCustomerId,
    onSelectCustomer,
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
  
  const handlePayment = (method: 'cash' | 'card') => {
    onConfirm({
      items: cart,
      subtotal,
      totalDiscountValue,
      serviceCharge,
      finalTotal,
      paymentMethod: method,
    });
  };

  const handleSelectCustomer = (value: string) => {
    const customerId = value === 'walk-in' ? null : Number(value);
    onSelectCustomer(customerId);
  }
  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.payment[language]}</DialogTitle>
          <DialogDescription>
            {UI_TEXT.selectPayment[language]}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="my-6 text-center">
              <p className="text-sm text-muted-foreground">{UI_TEXT.totalAmountDue[language]}</p>
              <p className="text-4xl font-bold text-primary">{finalTotal.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer" className="flex items-center gap-2 text-sm">
                <UserPlus size={14}/> {UI_TEXT.customer[language]}
            </Label>
            <Select onValueChange={handleSelectCustomer} value={selectedCustomerId?.toString() || 'walk-in'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <SelectTrigger>
                    <SelectValue placeholder={UI_TEXT.selectCustomer[language]} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="walk-in">{UI_TEXT.walkInCustomer[language]}</SelectItem>
                    {customers.map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-4 pt-4">
          <Button size="lg" onClick={() => handlePayment('cash')} className="bg-green-600 text-white hover:bg-green-700">
            <Wallet className={language === 'ar' ? "ml-2 h-5 w-5" : "mr-2 h-5 w-5"} />
            {UI_TEXT.cash[language]}
          </Button>
          <Button size="lg" onClick={() => handlePayment('card')}>
            <CreditCard className={language === 'ar' ? "ml-2 h-5 w-5" : "mr-2 h-5 w-5"} />
            {UI_TEXT.card[language]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
