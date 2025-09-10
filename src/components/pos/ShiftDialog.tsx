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
import { Shift, Sale, Expense } from '@/lib/types';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type Language = 'en' | 'ar';

const UI_TEXT = {
  startShift: { en: 'Start New Shift', ar: 'بدء شفت جديد' },
  endShift: { en: 'End Shift', ar: 'إنهاء الشفت' },
  startShiftInfo: { en: 'Enter the starting cash amount.', ar: 'أدخل مبلغ النقدية الافتتاحي.' },
  endShiftInfo: { en: 'Review the shift summary and enter the ending cash amount.', ar: 'راجع ملخص الشفت وأدخل مبلغ النقدية الختامي.' },
  startingCash: { en: 'Starting Cash', ar: 'النقدية الافتتاحية' },
  endingCash: { en: 'Ending Cash', ar: 'النقدية الختامية' },
  shiftDetails: { en: 'Shift Summary', ar: 'ملخص الشفت' },
  startTime: { en: 'Start Time', ar: 'وقت البدء' },
  totalSales: { en: 'Total Sales', ar: 'إجمالي المبيعات' },
  totalExpenses: { en: 'Total Expenses', ar: 'إجمالي المصروفات' },
  expectedCash: { en: 'Expected Cash in Drawer', ar: 'النقدية المتوقعة بالخزينة' },
  difference: { en: 'Difference', ar: 'الفرق' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  start: { en: 'Start', ar: 'بدء' },
  end: { en: 'End Shift', ar: 'إنهاء الشفت' },
  close: { en: 'Close', ar: 'إغلاق' },
};

interface ShiftDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (shiftData: Partial<Shift>) => void;
  activeShift: Shift | null;
  language: Language;
  sales: Sale[];
  expenses: Expense[];
}

const ShiftDialog: React.FC<ShiftDialogProps> = ({ isOpen, onOpenChange, onSave, activeShift, language, sales, expenses }) => {
  const [startingCash, setStartingCash] = React.useState(0);
  const [endingCash, setEndingCash] = React.useState(0);

  const handleSave = () => {
    if (activeShift) {
        onSave({ endingCash });
    } else {
        onSave({ startingCash });
    }
    onOpenChange(false);
  };
  
  React.useEffect(() => {
    if (!isOpen) {
        setStartingCash(0);
        setEndingCash(0);
    }
  }, [isOpen]);

  const { totalSalesInShift, totalExpensesInShift } = React.useMemo(() => {
    if (!activeShift) return { totalSalesInShift: 0, totalExpensesInShift: 0 };
    
    const salesInShift = sales.filter(sale => new Date(sale.createdAt) >= new Date(activeShift.startTime));
    const expensesInShift = expenses.filter(exp => exp.shiftId === activeShift.id);
    
    const totalSales = salesInShift.reduce((sum, sale) => sum + sale.finalTotal, 0);
    const totalExpenses = expensesInShift.reduce((sum, exp) => sum + exp.amount, 0);

    return { totalSalesInShift: totalSales, totalExpensesInShift: totalExpenses };
  }, [activeShift, sales, expenses]);


  const expectedCash = activeShift ? activeShift.startingCash + totalSalesInShift - totalExpensesInShift : 0;
  const difference = activeShift ? endingCash - expectedCash : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{activeShift ? UI_TEXT.endShift[language] : UI_TEXT.startShift[language]}</DialogTitle>
          <DialogDescription>
            {activeShift ? UI_TEXT.endShiftInfo[language] : UI_TEXT.startShiftInfo[language]}
          </DialogDescription>
        </DialogHeader>
        
        {activeShift ? (
            <div className="grid gap-4 py-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{UI_TEXT.shiftDetails[language]}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm pt-2">
                        <div className="flex justify-between"><span>{UI_TEXT.startTime[language]}:</span> <span>{new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(activeShift.startTime))}</span></div>
                        <div className="flex justify-between"><span>{UI_TEXT.startingCash[language]}:</span> <span>{activeShift.startingCash.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>{UI_TEXT.totalSales[language]}:</span> <span className="font-semibold text-green-600">(+) {totalSalesInShift.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>{UI_TEXT.totalExpenses[language]}:</span> <span className="font-semibold text-red-600">(-) {totalExpensesInShift.toFixed(2)}</span></div>
                        <Separator />
                        <div className="flex justify-between font-bold"><span>{UI_TEXT.expectedCash[language]}:</span> <span>{expectedCash.toFixed(2)}</span></div>
                    </CardContent>
                </Card>
                <div className="space-y-2">
                    <Label htmlFor="ending-cash">{UI_TEXT.endingCash[language]}</Label>
                    <Input id="ending-cash" type="number" value={endingCash} onChange={e => setEndingCash(Number(e.target.value))} dir="ltr" />
                </div>
                 <div className="flex justify-between font-bold text-lg p-2 rounded-md bg-muted">
                    <span>{UI_TEXT.difference[language]}:</span>
                    <span className={difference === 0 ? '' : difference > 0 ? 'text-green-600' : 'text-red-600'}>
                        {difference.toFixed(2)}
                    </span>
                </div>
            </div>
        ) : (
             <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="starting-cash">{UI_TEXT.startingCash[language]}</Label>
                    <Input id="starting-cash" type="number" value={startingCash} onChange={e => setStartingCash(Number(e.target.value))} dir="ltr" />
                </div>
            </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{UI_TEXT.cancel[language]}</Button>
          <Button onClick={handleSave} className={activeShift ? '' : 'bg-green-600 hover:bg-green-700'} variant={activeShift ? "destructive" : "default"}>{activeShift ? UI_TEXT.end[language] : UI_TEXT.start[language]}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftDialog;
