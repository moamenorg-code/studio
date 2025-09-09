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
import { Expense } from '@/lib/types';
import { Textarea } from '../ui/textarea';

type Language = 'en' | 'ar';

const UI_TEXT = {
  addExpense: { en: 'Add Expense', ar: 'إضافة مصروف' },
  expenseInfo: { en: 'Enter expense details below.', ar: 'أدخل تفاصيل المصروف أدناه.' },
  description: { en: 'Description', ar: 'الوصف' },
  amount: { en: 'Amount', ar: 'المبلغ' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
};

interface ExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  language: Language;
}

const ExpenseDialog: React.FC<ExpenseDialogProps> = ({ isOpen, onOpenChange, onSave, language }) => {
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState(0);

  const handleSave = () => {
    if (description && amount > 0) {
      onSave({ description, amount });
      onOpenChange(false);
    }
  };
  
  React.useEffect(() => {
    if (!isOpen) {
        setDescription('');
        setAmount(0);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.addExpense[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.expenseInfo[language]}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">{UI_TEXT.description[language]}</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">{UI_TEXT.amount[language]}</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} dir="ltr" />
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

export default ExpenseDialog;
