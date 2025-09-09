import * as React from 'react';
import { PlayCircle, StopCircle, MoreHorizontal } from 'lucide-react';
import type { Shift, Sale, Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import ShiftDialog from './ShiftDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageShifts: { en: 'Manage Shifts', ar: 'إدارة الشفتات' },
  trackShifts: { en: 'Start, end, and review work shifts.', ar: 'بدء وإنهاء ومراجعة شفتات العمل.' },
  startShift: { en: 'Start Shift', ar: 'بدء شفت' },
  endShift: { en: 'End Active Shift', ar: 'إنهاء الشفت الحالي' },
  shiftId: { en: 'Shift ID', ar: 'معرف الشفت' },
  startTime: { en: 'Start Time', ar: 'وقت البدء' },
  endTime: { en: 'End Time', ar: 'وقت الانتهاء' },
  status: { en: 'Status', ar: 'الحالة' },
  startingCash: { en: 'Starting Cash', ar: 'النقدية الافتتاحية' },
  endingCash: { en: 'Ending Cash', ar: 'النقدية الختامية' },
  totalSales: { en: 'Total Sales', ar: 'إجمالي المبيعات' },
  difference: { en: 'Difference', ar: 'الفرق' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  viewDetails: { en: 'View Details', ar: 'عرض التفاصيل' },
  open: { en: 'Open', ar: 'مفتوح' },
  closed: { en: 'Closed', ar: 'مغلق' },
  noShifts: { en: 'No shifts found.', ar: 'لم يتم العثور على شفتات.' },
};

interface ShiftsManagementTabProps {
  shifts: Shift[];
  onShiftsChange: (shifts: Shift[]) => void;
  sales: Sale[];
  expenses: Expense[];
  language: Language;
}

const ShiftsManagementTab: React.FC<ShiftsManagementTabProps> = ({ shifts, onShiftsChange, sales, expenses, language }) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const activeShift = React.useMemo(() => shifts.find(s => s.status === 'open'), [shifts]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleSaveShift = (shiftData: Partial<Shift>) => {
    if (activeShift) {
      // Ending a shift
      const salesInShift = sales.filter(sale => new Date(sale.createdAt) >= new Date(activeShift.startTime));
      const expensesInShift = expenses.filter(exp => new Date(exp.createdAt) >= new Date(activeShift.startTime));
      
      const totalSales = salesInShift.reduce((sum, sale) => sum + sale.finalTotal, 0);
      const totalExpenses = expensesInShift.reduce((sum, exp) => sum + exp.amount, 0);

      const updatedShift: Shift = {
        ...activeShift,
        endTime: new Date(),
        endingCash: shiftData.endingCash || 0,
        status: 'closed',
        totalSales,
        totalExpenses,
      };
      onShiftsChange(shifts.map(s => s.id === activeShift.id ? updatedShift : s));
    } else {
      // Starting a new shift
      const newShift: Shift = {
        id: Date.now(),
        startTime: new Date(),
        endTime: null,
        startingCash: shiftData.startingCash || 0,
        endingCash: null,
        totalSales: 0,
        totalExpenses: 0,
        status: 'open',
      };
      onShiftsChange([...shifts, newShift]);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.manageShifts[language]}</CardTitle>
              <CardDescription>{UI_TEXT.trackShifts[language]}</CardDescription>
            </div>
            <Button onClick={handleOpenDialog} className="w-full sm:w-auto" variant={activeShift ? 'destructive' : 'default'}>
              {activeShift ? (
                <>
                  <StopCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
                  {UI_TEXT.endShift[language]}
                </>
              ) : (
                <>
                  <PlayCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
                  {UI_TEXT.startShift[language]}
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{UI_TEXT.status[language]}</TableHead>
                  <TableHead>{UI_TEXT.startTime[language]}</TableHead>
                  <TableHead>{UI_TEXT.endTime[language]}</TableHead>
                  <TableHead>{UI_TEXT.startingCash[language]}</TableHead>
                  <TableHead>{UI_TEXT.totalSales[language]}</TableHead>
                  <TableHead>{UI_TEXT.endingCash[language]}</TableHead>
                  <TableHead className="text-end">{UI_TEXT.difference[language]}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.length > 0 ? (
                  shifts.map(shift => {
                    const difference = shift.endingCash !== null ? shift.endingCash - (shift.startingCash + shift.totalSales - shift.totalExpenses) : null;
                    return (
                        <TableRow key={shift.id}>
                        <TableCell>
                            <Badge variant={shift.status === 'open' ? 'default' : 'secondary'}>
                            {shift.status === 'open' ? UI_TEXT.open[language] : UI_TEXT.closed[language]}
                            </Badge>
                        </TableCell>
                        <TableCell>{new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(shift.startTime))}</TableCell>
                        <TableCell>{shift.endTime ? new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(shift.endTime)) : '-'}</TableCell>
                        <TableCell>{shift.startingCash.toFixed(2)}</TableCell>
                        <TableCell>{shift.totalSales.toFixed(2)}</TableCell>
                        <TableCell>{shift.endingCash !== null ? shift.endingCash.toFixed(2) : '-'}</TableCell>
                        <TableCell className={`text-end font-medium ${difference === null ? '' : (difference === 0 ? '' : (difference > 0 ? 'text-green-600' : 'text-red-600'))}`}>
                            {difference !== null ? difference.toFixed(2) : '-'}
                        </TableCell>
                        </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {UI_TEXT.noShifts[language]}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <ShiftDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveShift}
        activeShift={activeShift}
        language={language}
      />
    </>
  );
};

export default ShiftsManagementTab;
