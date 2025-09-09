import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import { CartItem } from '@/lib/types';
import { Badge } from '../ui/badge';

type Language = 'en' | 'ar';

const UI_TEXT = {
  splitBill: { en: 'Split Bill', ar: 'تقسيم الفاتورة' },
  splitBillDesc: { en: 'Move items from the main bill to new bills to split the payment.', ar: 'انقل الأصناف من الفاتورة الرئيسية إلى فواتير جديدة لتقسيم الدفع.' },
  mainBill: { en: 'Main Bill', ar: 'الفاتورة الرئيسية' },
  newBill: { en: 'New Bill', ar: 'فاتورة جديدة' },
  addBill: { en: 'Add New Bill', ar: 'إضافة فاتورة جديدة' },
  total: { en: 'Total', ar: 'الإجمالي' },
  pay: { en: 'Pay', ar: 'دفع' },
  items: { en: 'items', ar: 'أصناف' },
  move: { en: 'Move', ar: 'نقل' },
  quantity: { en: 'Quantity', ar: 'الكمية' },
};

interface SplitBillDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onProcessPayment: (cartToPay: CartItem[]) => void;
  language: Language;
  currency: string;
}

const SplitBillDialog: React.FC<SplitBillDialogProps> = ({ isOpen, onOpenChange, cart, onProcessPayment, language, currency }) => {
  const [mainBillItems, setMainBillItems] = React.useState<CartItem[]>([]);
  const [splits, setSplits] = React.useState<CartItem[][]>([]);

  React.useEffect(() => {
    if (isOpen) {
      // Deep copy to prevent modifying the original cart state directly
      setMainBillItems(JSON.parse(JSON.stringify(cart)));
      setSplits([]);
    }
  }, [isOpen, cart]);

  const handleAddNewSplit = () => {
    setSplits(prev => [...prev, []]);
  };

  const moveItem = (item: CartItem, from: 'main' | number, to: 'main' | number) => {
    // This logic handles moving one quantity of an item
    const quantityToMove = 1;

    let sourceItems: CartItem[] = [];
    let setSourceItems: React.Dispatch<React.SetStateAction<CartItem[]>> | ((newItems: CartItem[][]) => void);
    
    if (from === 'main') {
        sourceItems = mainBillItems;
        setSourceItems = setMainBillItems;
    } else {
        sourceItems = splits[from];
        setSourceItems = (updater) => {
            const newSplits = [...splits];
            newSplits[from] = typeof updater === 'function' ? updater(splits[from]) : updater;
            setSplits(newSplits);
        };
    }
    
    const updatedSourceItems = [...sourceItems];
    const itemInSourceIndex = updatedSourceItems.findIndex(i => i.id === item.id);
    const itemInSource = { ...updatedSourceItems[itemInSourceIndex] };

    // Decrease quantity in source
    if (itemInSource.quantity > quantityToMove) {
        itemInSource.quantity -= quantityToMove;
        updatedSourceItems[itemInSourceIndex] = itemInSource;
    } else {
        updatedSourceItems.splice(itemInSourceIndex, 1);
    }
    (setSourceItems as any)(updatedSourceItems);


    // Add or increase quantity in destination
    let destItems: CartItem[] = [];
    let setDestItems: React.Dispatch<React.SetStateAction<CartItem[]>> | ((newItems: CartItem[][]) => void);

    if (to === 'main') {
        destItems = mainBillItems;
        setDestItems = setMainBillItems;
    } else {
        destItems = splits[to];
        setDestItems = (updater) => {
            const newSplits = [...splits];
            newSplits[to] = typeof updater === 'function' ? updater(splits[to]) : updater;
            setSplits(newSplits);
        };
    }

    const updatedDestItems = [...destItems];
    const itemInDestIndex = updatedDestItems.findIndex(i => i.id === item.id);
    
    if (itemInDestIndex > -1) {
        const itemInDest = { ...updatedDestItems[itemInDestIndex] };
        itemInDest.quantity += quantityToMove;
        updatedDestItems[itemInDestIndex] = itemInDest;
    } else {
        updatedDestItems.push({ ...item, quantity: quantityToMove });
    }
     (setDestItems as any)(updatedDestItems);
  };
  
  const calculateTotal = (items: CartItem[]) => items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const ArrowComponent = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.splitBill[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.splitBillDesc[language]}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-hidden h-full">
            {/* Main Bill */}
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle>{UI_TEXT.mainBill[language]}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-2">
                    <ScrollArea className="h-full">
                       <div className="space-y-2 p-2">
                            {mainBillItems.map(item => (
                                <div key={item.id} className="flex items-center gap-2 p-2 rounded-md border">
                                    <div className="flex-1 text-start">
                                        <p className="font-medium">{language === 'ar' ? item.nameAr : item.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.price.toFixed(2)}</p>
                                    </div>
                                    <Badge variant="secondary" className="text-lg">{item.quantity}</Badge>
                                    <div className="flex flex-col gap-1">
                                        {splits.map((_, index) => (
                                            <Button key={index} size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveItem(item, 'main', index)}>
                                                <ArrowComponent className="h-4 w-4" />
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                       </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex-col items-stretch space-y-2 border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                        <span>{UI_TEXT.total[language]}</span>
                        <span>{calculateTotal(mainBillItems).toFixed(2)} {currency}</span>
                    </div>
                     <Button size="lg" onClick={() => onProcessPayment(mainBillItems)} disabled={mainBillItems.length === 0}>
                        {UI_TEXT.pay[language]}
                    </Button>
                </CardFooter>
            </Card>

            {/* Splits */}
            <div className="lg:col-span-2 flex flex-col h-full">
                <ScrollArea className="flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                    {splits.map((splitItems, splitIndex) => (
                        <Card key={splitIndex} className="flex flex-col h-full">
                            <CardHeader>
                                <CardTitle>{UI_TEXT.newBill[language]} {splitIndex + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden p-2">
                                <ScrollArea className="h-full">
                                    <div className="space-y-2 p-2">
                                        {splitItems.map(item => (
                                            <div key={item.id} className="flex items-center gap-2 p-2 rounded-md border">
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveItem(item, splitIndex, 'main')}>
                                                    {language === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                                                </Button>
                                                <Badge variant="secondary" className="text-lg">{item.quantity}</Badge>
                                                <div className="flex-1 text-end">
                                                    <p className="font-medium">{language === 'ar' ? item.nameAr : item.name}</p>
                                                    <p className="text-sm text-muted-foreground">{item.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="flex-col items-stretch space-y-2 border-t pt-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>{UI_TEXT.total[language]}</span>
                                    <span>{calculateTotal(splitItems).toFixed(2)} {currency}</span>
                                </div>
                                <Button size="lg" onClick={() => onProcessPayment(splitItems)} disabled={splitItems.length === 0}>
                                    {UI_TEXT.pay[language]}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    </div>
                </ScrollArea>
                <div className="mt-4">
                    <Button variant="outline" className="w-full" onClick={handleAddNewSplit} disabled={splits.length >= 3}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {UI_TEXT.addBill[language]}
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SplitBillDialog;
