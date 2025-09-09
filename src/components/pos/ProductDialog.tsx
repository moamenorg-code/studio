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
import { Product } from '@/lib/types';

type Language = 'en' | 'ar';

const UI_TEXT = {
  editProduct: { en: 'Edit Product', ar: 'تعديل المنتج' },
  addProduct: { en: 'Add Product', ar: 'إضافة منتج' },
  productInfo: { en: 'Provide the product details below.', ar: 'أدخل تفاصيل المنتج أدناه.' },
  nameEn: { en: 'Name (English)', ar: 'الاسم (الإنجليزية)' },
  nameAr: { en: 'Name (Arabic)', ar: 'الاسم (العربية)' },
  price: { en: 'Price', ar: 'السعر' },
  barcode: { en: 'Barcode', ar: 'الباركود' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
};

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Omit<Product, 'id'> | Product) => void;
  product: Product | null;
  language: Language;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ isOpen, onOpenChange, onSave, product, language }) => {
  const [formData, setFormData] = React.useState<Partial<Product>>({});

  React.useEffect(() => {
    if (isOpen) {
        if (product) {
          setFormData(product);
        } else {
          setFormData({
            name: '',
            nameAr: '',
            price: 0,
            barcode: '',
          });
        }
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = () => {
    if (formData.name && formData.nameAr && formData.price! > 0) {
      onSave(formData as Product);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? UI_TEXT.editProduct[language] : UI_TEXT.addProduct[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.productInfo[language]}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{UI_TEXT.nameEn[language]}</Label>
            <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameAr">{UI_TEXT.nameAr[language]}</Label>
            <Input id="nameAr" name="nameAr" value={formData.nameAr || ''} onChange={handleChange} dir="rtl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">{UI_TEXT.price[language]}</Label>
            <Input id="price" name="price" type="number" value={formData.price || ''} onChange={handleChange} dir="ltr" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="barcode">{UI_TEXT.barcode[language]}</Label>
            <Input id="barcode" name="barcode" value={formData.barcode || ''} onChange={handleChange} dir="ltr" />
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

export default ProductDialog;
