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
import { CreditCard, Wallet, UserPlus, Check, ChevronsUpDown } from 'lucide-react';
import { Label } from '../ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from '@/lib/utils';
import CustomerDialog from './CustomerDialog';

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
    addCustomer: { en: 'Add Customer', ar: 'إضافة عميل' },
    searchCustomer: { en: 'Search customer...', ar: 'ابحث عن عميل بالاسم أو الهاتف...' },
    noCustomerFound: { en: 'No customer found.', ar: 'لم يتم العثور على عميل.' },
};

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onConfirm: (saleData: Omit<Sale, "id" | "createdAt" | "customer" | "tableId">) => void;
  language: Language;
  customers: Customer[];
  selectedCustomerId: number | null;
  onSelectCustomer: (id: number | null) => void;
  onCustomerUpdate: (customers: Customer[]) => void;
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
    onCustomerUpdate
 }) => {
  const [overallDiscount] = React.useState(0);
  const [serviceCharge] = React.useState(0);
  const [isCustomerDialogOpen, setCustomerDialogOpen] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  const subtotal = React.useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  
  const totalDiscountValue = React.useMemo(() => {
    const itemDiscounts = cart.reduce((acc, item) => acc + (item.price * item.quantity * (item.discount / 100)), 0);
    const overallDiscountValue = subtotal * (overallDiscount / 100);
    return itemDiscounts + overallDiscountValue;
  }, [cart, subtotal, overallDiscount]);
  
  const finalTotal = React.useMemo(() => subtotal - totalDiscountValue + serviceCharge, [subtotal, totalDiscountValue, serviceCharge]);
  
  const handlePayment = (method: 'cash' | 'card') => {
    if (cart.length === 0) return;
    onConfirm({
      items: cart,
      subtotal,
      totalDiscountValue,
      serviceCharge,
      finalTotal,
      paymentMethod: method,
    });
  };

  const handleSelectCustomer = (customerId: number | null) => {
    onSelectCustomer(customerId);
    setPopoverOpen(false);
  }
  
  const handleSaveCustomer = (customer: Customer) => {
    const newCustomer = { ...customer, id: Date.now() };
    const updatedCustomers = [...customers, newCustomer];
    onCustomerUpdate(updatedCustomers);
    onSelectCustomer(newCustomer.id);
    setCustomerDialogOpen(false);
  };
  
  const selectedCustomerName = React.useMemo(() => {
    if (selectedCustomerId === null) return UI_TEXT.walkInCustomer[language];
    return customers.find(c => c.id === selectedCustomerId)?.name || UI_TEXT.selectCustomer[language];
  }, [selectedCustomerId, customers, language]);

  if (!isOpen) return null;

  return (
    <>
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
            <Label htmlFor="customer" className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                    <UserPlus size={14}/> {UI_TEXT.customer[language]}
                </span>
                <Button variant="link" className="p-0 h-auto" onClick={() => setCustomerDialogOpen(true)}>{UI_TEXT.addCustomer[language]}</Button>
            </Label>
             <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className="w-full justify-between"
                    >
                    {selectedCustomerName}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder={UI_TEXT.searchCustomer[language]} />
                        <CommandList>
                            <CommandEmpty>{UI_TEXT.noCustomerFound[language]}</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => handleSelectCustomer(null)}
                                >
                                    <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedCustomerId === null ? "opacity-100" : "opacity-0"
                                    )}
                                    />
                                    {UI_TEXT.walkInCustomer[language]}
                                </CommandItem>
                                {customers.map((customer) => (
                                <CommandItem
                                    key={customer.id}
                                    value={`${customer.name} ${customer.phone}`}
                                    onSelect={() => handleSelectCustomer(customer.id)}
                                >
                                    <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedCustomerId === customer.id ? "opacity-100" : "opacity-0"
                                    )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{customer.name}</span>
                                        <span className="text-xs text-muted-foreground" dir="ltr">{customer.phone}</span>
                                    </div>
                                </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
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
    <CustomerDialog
        isOpen={isCustomerDialogOpen}
        onOpenChange={setCustomerDialogOpen}
        onSave={handleSaveCustomer}
        customer={null}
        language={language}
    />
    </>
  );
};

export default PaymentDialog;
