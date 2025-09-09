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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CashDrawerEntry } from '@/lib/types';

type Language = 'en' | 'ar';

const UI_TEXT = {
  addTransaction: { en: 'Add Cash Transaction', ar: 'إضافة حركة نقدية' },
  transactionInfo: { en: 'Enter transaction details below.', ar: 'أدخل تفاصيل الحركة أدناه.' },
  type: { en: 'Type', ar: 'النوع' },
  cashIn: { en: 'Cash In', ar: 'نقدية واردة' },
  cashOut: { en: 'Cash Out', ar: 'نقدية صادرة' },
  amount: { en: 'Amount', ar: 'المبلغ' },
  reason: { en: 'Reason', ar: 'السبب' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
};

interface CashDrawerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Omit<CashDrawerEntry, 'id' | 'createdAt'>) => void;
  language: Language;
}

const CashDrawerDialog: React.FC<CashDrawerDialogProps> = ({ isOpen, onOpenChange, onSave, language }) => {
  const [type, setType] = React.useState<'cash_in' | 'cash_out'>('cash_out');
  const [amount, setAmount] = React.useState(0);
  const [reason, setReason] = React.useState('');

  const handleSave = () => {
    if (amount > 0 && reason) {
      onSave({ type, amount, reason });
      onOpenChange(false);
    }
  };
  
  React.useEffect(() => {
    if (!isOpen) {
        setType('cash_out');
        setAmount(0);
        setReason('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.addTransaction[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.transactionInfo[language]}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>{UI_TEXT.type[language]}</Label>
            <RadioGroup defaultValue="cash_out" onValueChange={(value) => setType(value as 'cash_in' | 'cash_out')} className="flex gap-4" dir="ltr">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash_in" id="cash_in" />
                <Label htmlFor="cash_in">{UI_TEXT.cashIn[language]}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash_out" id="cash_out" />
                <Label htmlFor="cash_out">{UI_TEXT.cashOut[language]}</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">{UI_TEXT.amount[language]}</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">{UI_TEXT.reason[language]}</Label>
            <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
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

export default CashDrawerDialog;
