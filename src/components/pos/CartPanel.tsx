import * as React from 'react';
import { MinusCircle, PlusCircle, Trash2, XCircle, UserPlus } from 'lucide-react';
import type { CartItem, Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from '@/lib/utils';
import CustomerDialog from './CustomerDialog';


type Language = 'en' | 'ar';

const UI_TEXT = {
    currentOrder: { en: 'Current Order', ar: 'الطلب الحالي' },
    noItems: { en: 'No items in cart.', ar: 'لا توجد أصناف في السلة.' },
    subtotal: { en: 'Subtotal', ar: 'المجموع الفرعي' },
    discount: { en: 'Discount (%)', ar: 'الخصم (%)' },
    serviceCharge: { en: 'Service Charge', ar: 'رسوم الخدمة' },
    finalTotal: { en: 'Final Total', ar: 'الإجمالي النهائي' },
    clearCart: { en: 'Clear Cart', ar: 'إفراغ السلة' },
    pay: { en: 'Pay', ar: 'الدفع' },
    customer: { en: 'Customer', ar: 'العميل' },
    selectCustomer: { en: 'Select a customer', ar: 'اختر عميل' },
    walkInCustomer: { en: 'Walk-in Customer', ar: 'عميل عابر' },
    addCustomer: { en: 'Add Customer', ar: 'إضافة عميل' },
    searchCustomer: { en: 'Search customer...', ar: 'ابحث عن عميل بالاسم أو الهاتف...' },
    noCustomerFound: { en: 'No customer found.', ar: 'لم يتم العثور على عميل.' },
};

interface CartPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  clearCart: () => void;
  onProcessPayment: () => void;
  language: Language;
  customers: Customer[];
  selectedCustomerId: number | null;
  onSelectCustomer: (id: number | null) => void;
  onCustomerUpdate: (customers: Customer[]) => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ 
    isOpen, 
    onOpenChange, 
    cart, 
    setCart, 
    clearCart, 
    onProcessPayment, 
    language,
    customers,
    selectedCustomerId,
    onSelectCustomer,
    onCustomerUpdate
}) => {
  const [overallDiscount, setOverallDiscount] = React.useState(0);
  const [serviceCharge, setServiceCharge] = React.useState(0);
  const [isCustomerDialogOpen, setCustomerDialogOpen] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  const updateQuantity = (id: number, delta: number) => {
    setCart(currentCart => {
      const newCart = currentCart.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      );
      const filteredCart = newCart.filter(item => item.quantity > 0);
      if (filteredCart.length === 0) {
        onOpenChange(false);
      }
      return filteredCart;
    });
  };
  
  const removeItem = (id: number) => {
    setCart(currentCart => {
      const newCart = currentCart.filter(item => item.id !== id);
      if (newCart.length === 0) {
        onOpenChange(false);
      }
      return newCart;
    });
  };

  const subtotal = React.useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  
  const totalDiscountValue = React.useMemo(() => {
    const itemDiscounts = cart.reduce((acc, item) => acc + (item.price * item.quantity * (item.discount / 100)), 0);
    const overallDiscountValue = subtotal * (overallDiscount / 100);
    return itemDiscounts + overallDiscountValue;
  }, [cart, subtotal, overallDiscount]);
  
  const finalTotal = React.useMemo(() => subtotal - totalDiscountValue + serviceCharge, [subtotal, totalDiscountValue, serviceCharge]);
  
  React.useEffect(() => {
      if (cart.length === 0) {
          setOverallDiscount(0);
          setServiceCharge(0);
      }
  }, [cart]);

  const handleSelectCustomer = (customerId: number | null) => {
      onSelectCustomer(customerId);
      setPopoverOpen(false)
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

  return (
    <>
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col sm:max-w-lg" side={language === 'ar' ? 'left' : 'right'}>
            <SheetHeader>
                <SheetTitle>{UI_TEXT.currentOrder[language]}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
                {cart.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>{UI_TEXT.noItems[language]}</p>
                </div>
                ) : (
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-4 py-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="flex-1">
                              <p className="font-medium">{language === 'ar' ? item.nameAr : item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}><MinusCircle className="h-4 w-4" /></Button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}><PlusCircle className="h-4 w-4" /></Button>
                          </div>
                          <p className="w-20 text-end font-medium">{(item.price * item.quantity).toFixed(2)}</p>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
                )}
            </div>
            {cart.length > 0 && (
            <SheetFooter className="flex-col items-stretch space-y-4 border-t pt-6">
                 <div className="space-y-2">
                    <Label htmlFor="customer" className="flex items-center justify-between text-sm">
                        <span className='flex items-center gap-2'>
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
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>{UI_TEXT.subtotal[language]}</span>
                        <span>{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="discount" className="text-sm">{UI_TEXT.discount[language]}</Label>
                        <Input 
                            id="discount"
                            type="number"
                            value={overallDiscount}
                            onChange={e => setOverallDiscount(Math.max(0, e.target.valueAsNumber || 0))}
                            className="h-8 w-24 text-end"
                            dir="ltr"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="service-charge" className="text-sm">{UI_TEXT.serviceCharge[language]}</Label>
                        <Input
                            id="service-charge"
                            type="number"
                            value={serviceCharge}
                            onChange={e => setServiceCharge(Math.max(0, e.target.valueAsNumber || 0))}
                            className="h-8 w-24 text-end"
                            dir="ltr"
                        />
                    </div>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                    <span>{UI_TEXT.finalTotal[language]}</span>
                    <span className="text-primary">{finalTotal.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={clearCart}>
                        <XCircle className={language === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />{UI_TEXT.clearCart[language]}
                    </Button>
                    <Button onClick={onProcessPayment} className="bg-green-600 text-white hover:bg-green-700">
                        {UI_TEXT.pay[language]}
                    </Button>
                </div>
            </SheetFooter>
            )}
        </SheetContent>
    </Sheet>
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

export default CartPanel;
