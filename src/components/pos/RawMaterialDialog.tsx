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
import { RawMaterial } from '@/lib/types';

type Language = 'en' | 'ar';

const UI_TEXT = {
  editRawMaterial: { en: 'Edit Raw Material', ar: 'تعديل المادة الخام' },
  addRawMaterial: { en: 'Add Raw Material', ar: 'إضافة مادة خام' },
  rawMaterialInfo: { en: 'Provide the material details below.', ar: 'أدخل تفاصيل المادة أدناه.' },
  nameEn: { en: 'Name (English)', ar: 'الاسم (الإنجليزية)' },
  nameAr: { en: 'Name (Arabic)', ar: 'الاسم (العربية)' },
  stock: { en: 'Stock', ar: 'الكمية' },
  unit: { en: 'Unit', ar: 'الوحدة' },
  cost: { en: 'Cost', ar: 'التكلفة' },
  barcode: { en: 'Barcode', ar: 'الباركود' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
};

interface RawMaterialDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (rawMaterial: Omit<RawMaterial, 'id'> | RawMaterial) => void;
  rawMaterial: RawMaterial | null;
  language: Language;
}

const RawMaterialDialog: React.FC<RawMaterialDialogProps> = ({ isOpen, onOpenChange, onSave, rawMaterial, language }) => {
  const [formData, setFormData] = React.useState<Partial<RawMaterial>>({});

  React.useEffect(() => {
    if (isOpen) {
        if (rawMaterial) {
          setFormData(rawMaterial);
        } else {
          setFormData({
            name: '',
            nameAr: '',
            stock: 0,
            unit: '',
            barcode: '',
            cost: 0,
          });
        }
    }
  }, [rawMaterial, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = () => {
    if (formData.name && formData.nameAr && formData.unit) {
      onSave(formData as RawMaterial);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{rawMaterial ? UI_TEXT.editRawMaterial[language] : UI_TEXT.addRawMaterial[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.rawMaterialInfo[language]}</DialogDescription>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="stock">{UI_TEXT.stock[language]}</Label>
                <Input id="stock" name="stock" type="number" value={formData.stock || ''} onChange={handleChange} dir="ltr" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="unit">{UI_TEXT.unit[language]}</Label>
                <Input id="unit" name="unit" value={formData.unit || ''} onChange={handleChange} />
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">{UI_TEXT.cost[language]}</Label>
                <Input id="cost" name="cost" type="number" value={formData.cost || ''} onChange={handleChange} dir="ltr" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="barcode">{UI_TEXT.barcode[language]}</Label>
                  <Input id="barcode" name="barcode" value={formData.barcode || ''} onChange={handleChange} dir="ltr" />
              </div>
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

export default RawMaterialDialog;
