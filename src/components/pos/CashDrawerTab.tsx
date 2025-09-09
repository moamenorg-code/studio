import * as React from 'react';
import { PlusCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { CashDrawerEntry, Shift } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import CashDrawerDialog from './CashDrawerDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wallet } from 'lucide-react';

type Language = 'en' | 'ar';

const UI_TEXT = {
  cashDrawer: { en: 'Cash Drawer', ar: 'الخزينة' },
  cashDrawerMovements: { en: 'Record and view cash movements.', ar: 'سجل واعرض حركات النقدية.' },
  addTransaction: { en: 'Add Transaction', ar: 'إضافة حركة' },
  type: { en: 'Type', ar: 'النوع' },
  amount: { en: 'Amount', ar: 'المبلغ' },
  reason: { en: 'Reason', ar: 'السبب' },
  date: { en: 'Date', ar: 'التاريخ' },
  cashIn: { en: 'Cash In', ar: 'نقدية واردة' },
  cashOut: { en: 'Cash Out', ar: 'نقدية صادرة' },
  noEntries: { en: 'No cash movements found for the active shift.', ar: 'لم يتم العثور على حركات نقدية للشفت الحالي.' },
  noActiveShift: { en: 'No Active Shift', ar: 'لا يوجد شفت نشط' },
  noActiveShiftDesc: { en: 'You must start a shift to manage the cash drawer.', ar: 'يجب أن تبدأ شفتًا لإدارة الخزينة.' },
};

interface CashDrawerTabProps {
  entries: CashDrawerEntry[];
  onEntriesChange: (entries: CashDrawerEntry[]) => void;
  language: Language;
  activeShift: Shift | null;
}

const CashDrawerTab: React.FC<CashDrawerTabProps> = ({ entries, onEntriesChange, language, activeShift }) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const handleSaveEntry = (entry: Omit<CashDrawerEntry, 'id' | 'createdAt' | 'shiftId'>) => {
    if (activeShift) {
        const newEntry: CashDrawerEntry = {
        ...entry,
        id: Date.now(),
        createdAt: new Date(),
        shiftId: activeShift.id,
        };
        onEntriesChange([...entries, newEntry]);
    }
  };
  
  const entriesForActiveShift = React.useMemo(() => {
    if (!activeShift) return [];
    return entries.filter(e => e.shiftId === activeShift.id);
  }, [entries, activeShift]);


  if (!activeShift) {
    return (
        <Card className="h-full flex items-center justify-center">
            <Alert className="w-auto">
                <Wallet className="h-4 w-4" />
                <AlertTitle>{UI_TEXT.noActiveShift[language]}</AlertTitle>
                <AlertDescription>{UI_TEXT.noActiveShiftDesc[language]}</AlertDescription>
            </Alert>
        </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.cashDrawer[language]}</CardTitle>
              <CardDescription>{UI_TEXT.cashDrawerMovements[language]}</CardDescription>
            </div>
            <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
              <PlusCircle className="me-2 h-4 w-4" />
              {UI_TEXT.addTransaction[language]}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-28rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{UI_TEXT.type[language]}</TableHead>
                  <TableHead>{UI_TEXT.reason[language]}</TableHead>
                  <TableHead>{UI_TEXT.date[language]}</TableHead>
                  <TableHead className="text-end">{UI_TEXT.amount[language]}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entriesForActiveShift.length > 0 ? (
                  entriesForActiveShift.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Badge variant={entry.type === 'cash_in' ? 'default' : 'destructive'} className="flex items-center gap-1 w-fit">
                           {entry.type === 'cash_in' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                           {entry.type === 'cash_in' ? UI_TEXT.cashIn[language] : UI_TEXT.cashOut[language]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{entry.reason}</TableCell>
                       <TableCell>
                        {new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(entry.createdAt)}
                      </TableCell>
                      <TableCell className={`text-end font-semibold ${entry.type === 'cash_in' ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      {UI_TEXT.noEntries[language]}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <CashDrawerDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveEntry}
        language={language}
      />
    </>
  );
};

export default CashDrawerTab;
