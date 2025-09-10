import * as React from 'react';
import type { CartItem, Sale, Customer, OrderType, DeliveryRep, Settings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { CreditCard, Wallet, Bike } from 'lucide-react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Language = 'en' | 'ar';

const UI_TEXT = {
    payment: { en: 'Payment', ar: 'الدفع' },
    totalAmountDue: { en: 'Total amount due:', ar: 'المبلغ الإجمالي المستحق:' },
    selectPayment: { en: 'Select Payment Method', ar: 'اختر طريقة الدفع' },
    cash: { en: 'Cash', ar: 'نقدي' },
    card: { en: 'Card', ar: 'بطاقة' },
    confirmPayment: { en: 'Confirm Payment', ar: 'تأكيد الدفع' },
    deliveryRep: { en: 'Delivery Rep', ar: 'مندوب التوصيل' },
    selectDeliveryRep: { en: 'Select a delivery rep', ar: 'اختر مندوب التوصيل' },
    deliveryFee: { en: 'Delivery Fee', ar: 'رسوم التوصيل' },
};

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onConfirm: (saleData: Omit<Sale, "id" | "createdAt" | "customer" | "orderType" | "orderId" | "userId">, paidCart: CartItem[]) => void;
  language: Language;
  customers: Customer[];
  selectedCustomerId: number | null;
  onSelectCustomer: (id: number | null) => void;
  onCustomerUpdate: (customers: Customer[]) => void;
  orderType?: OrderType;
  deliveryReps: DeliveryRep[];
  settings: Settings;
  overallDiscount: number;
  serviceCharge: number;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ 
    isOpen, 
    onOpenChange, 
    cart, 
    onConfirm, 
    language,
    orderType,
    deliveryReps,
    settings,
    overallDiscount,
    serviceCharge,
 }) => {
  const [selectedRepId, setSelectedRepId] = React.useState<number | undefined>();

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
      deliveryRepId: selectedRepId
    }, cart);
  };

  React.useEffect(() => {
    if (!isOpen) {
        setSelectedRepId(undefined);
    }
  },[isOpen]);

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
          
          {orderType === 'delivery' && (
              <div className="space-y-2">
                <Label htmlFor="delivery-rep">{UI_TEXT.deliveryRep[language]}</Label>
                <Select onValueChange={(value) => setSelectedRepId(Number(value))} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <SelectTrigger id="delivery-rep">
                        <SelectValue placeholder={UI_TEXT.selectDeliveryRep[language]} />
                    </SelectTrigger>
                    <SelectContent>
                        {deliveryReps.map(rep => (
                            <SelectItem key={rep.id} value={String(rep.id)}>{rep.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{UI_TEXT.deliveryFee[language]}</span>
                    <span>{serviceCharge.toFixed(2)}</span>
                </div>
              </div>
          )}

          <div className="my-6 text-center">
              <p className="text-sm text-muted-foreground">{UI_TEXT.totalAmountDue[language]}</p>
              <p className="text-4xl font-bold text-primary">{finalTotal.toFixed(2)}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
              <Button size="lg" onClick={() => handlePayment('cash')} className="bg-green-600 text-white hover:bg-green-700">
                  <Wallet className="me-2 h-5 w-5" />
                  {UI_TEXT.cash[language]}
              </Button>
              <Button size="lg" onClick={() => handlePayment('card')}>
                  <CreditCard className="me-2 h-5 w-5" />
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
