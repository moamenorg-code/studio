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
import { Supplier } from '@/lib/types';

type Language = 'en' | 'ar';

const UI_TEXT = {
  editSupplier: { en: 'Edit Supplier', ar: 'تعديل المورد' },
  addSupplier: { en: 'Add Supplier', ar: 'إضافة مورد' },
  supplierInfo: { en: 'Provide the supplier details below.', ar: 'أدخل تفاصيل المورد أدناه.' },
  name: { en: 'Name', ar: 'الاسم' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  address: { en: 'Address', ar: 'العنوان' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
};

interface SupplierDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (supplier: Supplier) => void;
  supplier: Supplier | null;
  language: Language;
}

const SupplierDialog: React.FC<SupplierDialogProps> = ({ isOpen, onOpenChange, onSave, supplier, language }) => {
  const [formData, setFormData] = React.useState<Partial<Supplier>>({});

  React.useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    } else {
      setFormData({
        name: '',
        phone: '',
        address: '',
      });
    }
  }, [supplier, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Basic validation
    if (formData.name && formData.phone) {
      onSave(formData as Supplier);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{supplier ? UI_TEXT.editSupplier[language] : UI_TEXT.addSupplier[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.supplierInfo[language]}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{UI_TEXT.name[language]}</Label>
            <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{UI_TEXT.phone[language]}</Label>
            <Input id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{UI_TEXT.address[language]}</Label>
            <Input id="address" name="address" value={formData.address || ''} onChange={handleChange} />
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

export default SupplierDialog;
