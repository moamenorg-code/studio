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
import { Customer } from '@/lib/types';

type Language = 'en' | 'ar';

const UI_TEXT = {
  editCustomer: { en: 'Edit Customer', ar: 'تعديل العميل' },
  addCustomer: { en: 'Add Customer', ar: 'إضافة عميل' },
  customerInfo: { en: 'Provide the customer details below.', ar: 'أدخل تفاصيل العميل أدناه.' },
  name: { en: 'Name', ar: 'الاسم' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  address: { en: 'Address', ar: 'العنوان' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
};

interface CustomerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (customer: Omit<Customer, 'id'> | Customer) => void;
  customer: Customer | null;
  language: Language;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({ isOpen, onOpenChange, onSave, customer, language }) => {
  const [formData, setFormData] = React.useState<Partial<Customer>>({});

  React.useEffect(() => {
    if (isOpen) {
      if (customer) {
        setFormData(customer);
      } else {
        setFormData({
          name: '',
          phone: '',
          address: '',
        });
      }
    }
  }, [customer, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (formData.name && formData.phone) {
      onSave(formData as Omit<Customer, 'id'> | Customer);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{customer ? UI_TEXT.editCustomer[language] : UI_TEXT.addCustomer[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.customerInfo[language]}</DialogDescription>
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

export default CustomerDialog;
