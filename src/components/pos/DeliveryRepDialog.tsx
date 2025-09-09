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
import { DeliveryRep } from '@/lib/types';

type Language = 'en' | 'ar';

const UI_TEXT = {
  editRep: { en: 'Edit Delivery Rep', ar: 'تعديل المندوب' },
  addRep: { en: 'Add Delivery Rep', ar: 'إضافة مندوب' },
  repInfo: { en: 'Provide the delivery rep details below.', ar: 'أدخل تفاصيل المندوب أدناه.' },
  name: { en: 'Name', ar: 'الاسم' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  commissionRate: { en: 'Commission Rate (%)', ar: 'نسبة العمولة (%)' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
};

interface DeliveryRepDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (rep: Omit<DeliveryRep, 'id'> | DeliveryRep) => void;
  rep: DeliveryRep | null;
  language: Language;
}

const DeliveryRepDialog: React.FC<DeliveryRepDialogProps> = ({ isOpen, onOpenChange, onSave, rep, language }) => {
  const [formData, setFormData] = React.useState<Partial<DeliveryRep>>({});

  React.useEffect(() => {
    if (isOpen) {
      if (rep) {
        setFormData(rep);
      } else {
        setFormData({
          name: '',
          phone: '',
          commissionRate: 0,
        });
      }
    }
  }, [rep, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    if (formData.name && formData.phone && formData.commissionRate! >= 0) {
      onSave(formData as DeliveryRep);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{rep ? UI_TEXT.editRep[language] : UI_TEXT.addRep[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.repInfo[language]}</DialogDescription>
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
            <Label htmlFor="commissionRate">{UI_TEXT.commissionRate[language]}</Label>
            <Input id="commissionRate" name="commissionRate" type="number" value={formData.commissionRate || 0} onChange={handleChange} dir="ltr" />
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

export default DeliveryRepDialog;
