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
import { Shift } from '@/lib/types';

type Language = 'en' | 'ar';

const UI_TEXT = {
  startShift: { en: 'Start New Shift', ar: 'بدء شفت جديد' },
  endShift: { en: 'End Shift', ar: 'إنهاء الشفت' },
  startShiftInfo: { en: 'Enter the starting cash amount.', ar: 'أدخل مبلغ النقدية الافتتاحي.' },
  endShiftInfo: { en: 'Enter the ending cash amount.', ar: 'أدخل مبلغ النقدية الختامي.' },
  startingCash: { en: 'Starting Cash', ar: 'النقدية الافتتاحية' },
  endingCash: { en: 'Ending Cash', ar: 'النقدية الختامية' },
  shiftDetails: { en: 'Shift Details', ar: 'تفاصيل الشفت' },
  startTime: { en: 'Start Time', ar: 'وقت البدء' },
  totalSales: { en: 'Total Sales', ar: 'إجمالي المبيعات' },
  totalExpenses: { en: 'Total Expenses', ar: 'إجمالي المصروفات' },
  expectedCash: { en: 'Expected Cash', ar: 'النقدية المتوقعة' },
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
}

const ShiftDialog: React.FC<ShiftDialogProps> = ({ isOpen, onOpenChange, onSave, activeShift, language }) => {
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

  const expectedCash = activeShift ? activeShift.startingCash + activeShift.totalSales - activeShift.totalExpenses : 0;
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
                    <CardHeader>
                        <CardTitle>{UI_TEXT.shiftDetails[language]}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>{UI_TEXT.startTime[language]}:</span> <span>{new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(activeShift.startTime))}</span></div>
                        <div className="flex justify-between"><span>{UI_TEXT.startingCash[language]}:</span> <span>{activeShift.startingCash.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>{UI_TEXT.totalSales[language]}:</span> <span className="text-green-600">{activeShift.totalSales.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>{UI_TEXT.totalExpenses[language]}:</span> <span className="text-red-600">{activeShift.totalExpenses.toFixed(2)}</span></div>
                        <Separator />
                        <div className="flex justify-between font-bold"><span>{UI_TEXT.expectedCash[language]}:</span> <span>{expectedCash.toFixed(2)}</span></div>
                    </CardContent>
                </Card>
                <div className="space-y-2">
                    <Label htmlFor="ending-cash">{UI_TEXT.endingCash[language]}</Label>
                    <Input id="ending-cash" type="number" value={endingCash} onChange={e => setEndingCash(Number(e.target.value))} dir="ltr" />
                </div>
                 <div className="flex justify-between font-bold text-lg">
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
          <Button onClick={handleSave}>{activeShift ? UI_TEXT.end[language] : UI_TEXT.start[language]}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


// Dummy components to avoid compilation errors, assuming they exist elsewhere
const Card: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="border rounded-lg">{children}</div>;
const CardHeader: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="p-4">{children}</div>;
const CardTitle: React.FC<{children: React.ReactNode}> = ({ children }) => <h3 className="font-bold text-lg">{children}</h3>;
const CardContent: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <div className={`p-4 pt-0 ${className}`}>{children}</div>;
const Separator: React.FC = () => <hr className="my-2" />;


export default ShiftDialog;
