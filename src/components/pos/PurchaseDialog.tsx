import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Supplier, RawMaterial, PurchaseItem, Product } from '@/lib/types';
import { PlusCircle, Trash2, ScanLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Language = 'en' | 'ar';

const UI_TEXT = {
  addPurchase: { en: 'Add Purchase Invoice', ar: 'إضافة فاتورة شراء' },
  purchaseInfo: { en: 'Fill in the purchase details below.', ar: 'املأ تفاصيل الفاتورة أدناه.' },
  supplier: { en: 'Supplier', ar: 'المورد' },
  selectSupplier: { en: 'Select a supplier', ar: 'اختر موردًا' },
  invoiceItems: { en: 'Invoice Items', ar: 'أصناف الفاتورة' },
  addItem: { en: 'Add Item', ar: 'إضافة صنف' },
  addByBarcode: { en: 'Add by Barcode', ar: 'إضافة بالباركود' },
  item: { en: 'Item', ar: 'الصنف' },
  quantity: { en: 'Quantity', ar: 'الكمية' },
  price: { en: 'Unit Price', ar: 'سعر الوحدة' },
  total: { en: 'Total', ar: 'الإجمالي' },
  invoiceTotal: { en: 'Invoice Total', ar: 'إجمالي الفاتورة' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
  productNotFound: { en: 'Product not found', ar: 'المنتج غير موجود' },
  productNotFoundDesc: { en: (barcode: string) => `No product with barcode ${barcode} found in raw materials.`, ar: (barcode: string) => `لم يتم العثور على منتج بالباركود ${barcode} في المواد الخام.`},
};

interface PurchaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => void;
  suppliers: Supplier[];
  rawMaterials: RawMaterial[];
  products: Product[]; // Pass all products to find by barcode
  language: Language;
  onOpenBarcodeScanner: (onDetect: (barcode: string) => void) => void;
}

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({ isOpen, onOpenChange, onSave, suppliers, rawMaterials, products, language, onOpenBarcodeScanner }) => {
  const [supplierId, setSupplierId] = React.useState<number | null>(null);
  const [items, setItems] = React.useState<PurchaseItem[]>([]);
  const [total, setTotal] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotal(newTotal);
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, { rawMaterialId: 0, name: '', nameAr: '', quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index: number, field: keyof PurchaseItem, value: any) => {
    const newItems = [...items];
    const currentItem = { ...newItems[index] };
    
    if (field === 'rawMaterialId') {
        const material = rawMaterials.find(m => m.id === Number(value));
        if (material) {
            currentItem.name = material.name;
            currentItem.nameAr = material.nameAr;
        }
    }
    
    (currentItem as any)[field] = value;
    newItems[index] = currentItem;
    setItems(newItems);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSave = () => {
    if (supplierId && items.length > 0) {
      onSave({ supplierId, items, total });
    }
  };
  
  const handleBarcodeScan = () => {
    onOpenBarcodeScanner((barcode) => {
        // Since purchase is for raw materials, we need to find which product uses this barcode,
        // and from there find the raw materials if a recipe is linked.
        // This example assumes a more direct link: a barcode on a raw material itself,
        // or that a "product" is being purchased as a "raw material". Let's find the raw material by barcode.
        const material = rawMaterials.find(rm => rm.barcode === barcode);

        if (material) {
             const existingItemIndex = items.findIndex(i => i.rawMaterialId === material.id);
             if(existingItemIndex > -1) {
                 handleItemChange(existingItemIndex, 'quantity', items[existingItemIndex].quantity + 1);
             } else {
                 setItems(prev => [...prev, {
                    rawMaterialId: material.id,
                    name: material.name,
                    nameAr: material.nameAr,
                    quantity: 1,
                    price: 0 // Default price, user should update
                 }]);
             }
        } else {
            toast({
                variant: 'destructive',
                title: UI_TEXT.productNotFound[language],
                description: UI_TEXT.productNotFoundDesc[language](barcode),
            });
        }
    });
  };


  React.useEffect(() => {
      if (!isOpen) {
          setSupplierId(null);
          setItems([]);
          setTotal(0);
      }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.addPurchase[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.purchaseInfo[language]}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="supplier">{UI_TEXT.supplier[language]}</Label>
            <Select onValueChange={(value) => setSupplierId(Number(value))} dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <SelectTrigger>
                <SelectValue placeholder={UI_TEXT.selectSupplier[language]} />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(s => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className='flex justify-between items-center mb-2'>
                <Label>{UI_TEXT.invoiceItems[language]}</Label>
                <div className='flex gap-2'>
                    <Button variant="outline" size="sm" onClick={handleBarcodeScan}>
                        <ScanLine className="me-2 h-4 w-4" />
                        {UI_TEXT.addByBarcode[language]}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleAddItem}>
                        <PlusCircle className="me-2 h-4 w-4" />
                        {UI_TEXT.addItem[language]}
                    </Button>
                </div>
            </div>
            <ScrollArea className="h-60 rounded-md border p-2">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                       <Select onValueChange={(value) => handleItemChange(index, 'rawMaterialId', Number(value))} value={String(item.rawMaterialId)} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            <SelectTrigger>
                                <SelectValue placeholder={UI_TEXT.item[language]} />
                            </SelectTrigger>
                            <SelectContent>
                                {rawMaterials.map(m => (
                                <SelectItem key={m.id} value={String(m.id)}>{language === 'ar' ? m.nameAr : m.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Input
                      type="number"
                      placeholder={UI_TEXT.quantity[language]}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      className="col-span-2 text-center"
                      dir="ltr"
                    />
                    <Input
                      type="number"
                      placeholder={UI_TEXT.price[language]}
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                      className="col-span-2 text-center"
                      dir="ltr"
                    />
                    <p className="col-span-2 text-center font-medium">{(item.quantity * item.price).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="col-span-1 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end items-center gap-4 text-xl font-bold mt-4">
            <Label>{UI_TEXT.invoiceTotal[language]}</Label>
            <span className="text-primary">{total.toFixed(2)}</span>
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{UI_TEXT.cancel[language]}</Button>
          <Button onClick={handleSave}>{UI_TEXT.save[language]}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
