import * as React from 'react';
import { MoreHorizontal, PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import type { DeliveryRep, Sale, Shift, Settings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import DeliveryRepDialog from './DeliveryRepDialog';
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageReps: { en: 'Manage Delivery Reps', ar: 'إدارة مندوبي التوصيل' },
  manageYourReps: { en: 'View, add, edit, and review performance of your delivery reps.', ar: 'عرض وإضافة وتعديل ومراجعة أداء مندوبي التوصيل.' },
  addRep: { en: 'Add Rep', ar: 'إضافة مندوب' },
  name: { en: 'Name', ar: 'الاسم' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  commission: { en: 'Commission', ar: 'العمولة' },
  orders: { en: 'Orders', ar: 'الطلبات' },
  totalDelivery: { en: 'Delivery Fees', ar: 'رسوم التوصيل' },
  totalSales: { en: 'Sales', ar: 'المبيعات' },
  totalCommission: { en: 'Total Commission', ar: 'إجمالي العمولة' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  noReps: { en: 'No delivery reps found.', ar: 'لم يتم العثور على مندوبين.' },
  dateRange: { en: 'Date Range', ar: 'النطاق الزمني' },
  pickDate: { en: 'Pick a date range', ar: 'اختر نطاقًا زمنيًا' },
  shift: { en: 'Shift', ar: 'الشفت' },
  currentShift: { en: 'Current Shift', ar: 'الشفت الحالي' },
  allShifts: { en: 'All Shifts', ar: 'كل الشفتات' },
};

interface DeliveryRepsTabProps {
  reps: DeliveryRep[];
  onRepsChange: (reps: DeliveryRep[]) => void;
  sales: Sale[];
  shifts: Shift[];
  language: Language;
  settings: Settings;
}

const DeliveryRepsTab: React.FC<DeliveryRepsTabProps> = ({ reps, onRepsChange, sales, shifts, language, settings }) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingRep, setEditingRep] = React.useState<DeliveryRep | null>(null);
  const [selectedShiftId, setSelectedShiftId] = React.useState<string>('current');
  const [date, setDate] = React.useState<DateRange | undefined>()

  const activeShift = React.useMemo(() => shifts.find(s => s.status === 'open'), [shifts]);

  const handleAddRep = () => {
    setEditingRep(null);
    setDialogOpen(true);
  };

  const handleEditRep = (rep: DeliveryRep) => {
    setEditingRep(rep);
    setDialogOpen(true);
  };

  const handleDeleteRep = (repId: number) => {
    onRepsChange(reps.filter(c => c.id !== repId));
  };
  
  const handleSaveRep = (repData: Omit<DeliveryRep, 'id'> | DeliveryRep) => {
    if ('id' in repData && editingRep) {
        onRepsChange(reps.map(c => (c.id === repData.id ? repData : c)));
    } else {
        const newRep = { ...repData, id: Date.now() };
        onRepsChange([...reps, newRep]);
    }
    setDialogOpen(false);
  };
  
  const filteredSales = React.useMemo(() => {
    let salesToFilter = sales.filter(s => s.orderType === 'delivery');
    
    if (selectedShiftId === 'current' && activeShift) {
       salesToFilter = salesToFilter.filter(s => new Date(s.createdAt) >= activeShift.startTime);
    } else if (selectedShiftId !== 'all' && selectedShiftId !== 'current') {
       const shift = shifts.find(s => String(s.id) === selectedShiftId);
       if (shift && shift.endTime) {
            salesToFilter = salesToFilter.filter(s => new Date(s.createdAt) >= shift.startTime && new Date(s.createdAt) <= shift.endTime!);
       }
    }

    if (date?.from && date?.to) {
        salesToFilter = salesToFilter.filter(s => new Date(s.createdAt) >= date.from! && new Date(s.createdAt) <= date.to!);
    }
    
    return salesToFilter;

  }, [sales, activeShift, selectedShiftId, shifts, date]);

  const repStats = React.useMemo(() => {
      return reps.map(rep => {
          const repSales = filteredSales.filter(sale => sale.deliveryRepId === rep.id);
          const totalOrders = repSales.length;
          const totalSalesValue = repSales.reduce((sum, sale) => sum + sale.finalTotal, 0);
          const totalDeliveryFees = totalOrders * settings.deliveryFee;
          const totalCommission = totalSalesValue * (rep.commissionRate / 100);

          return {
              ...rep,
              totalOrders,
              totalSalesValue,
              totalDeliveryFees,
              totalCommission
          }
      })
  }, [reps, filteredSales, settings.deliveryFee]);


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.manageReps[language]}</CardTitle>
              <CardDescription>{UI_TEXT.manageYourReps[language]}</CardDescription>
            </div>
             <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
                <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
                    <SelectTrigger>
                        <SelectValue placeholder={UI_TEXT.shift[language]} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="current">{UI_TEXT.currentShift[language]}</SelectItem>
                        <SelectItem value="all">{UI_TEXT.allShifts[language]}</SelectItem>
                        {shifts.filter(s => s.status === 'closed').map(s => (
                            <SelectItem key={s.id} value={String(s.id)}>
                                {new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(s.startTime)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                        ) : (
                        <span>{UI_TEXT.pickDate[language]}</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>

                <Button onClick={handleAddRep} className="w-full sm:w-auto">
                    <PlusCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
                    {UI_TEXT.addRep[language]}
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{UI_TEXT.name[language]}</TableHead>
                  <TableHead>{UI_TEXT.phone[language]}</TableHead>
                  <TableHead>{UI_TEXT.commission[language]}</TableHead>
                  <TableHead>{UI_TEXT.orders[language]}</TableHead>
                  <TableHead>{UI_TEXT.totalDelivery[language]}</TableHead>
                  <TableHead>{UI_TEXT.totalSales[language]}</TableHead>
                  <TableHead>{UI_TEXT.totalCommission[language]}</TableHead>
                  <TableHead>
                    <span className="sr-only">{UI_TEXT.actions[language]}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repStats.length > 0 ? (
                  repStats.map(rep => (
                    <TableRow key={rep.id}>
                      <TableCell className="font-medium">{rep.name}</TableCell>
                      <TableCell dir="ltr">{rep.phone}</TableCell>
                      <TableCell>{rep.commissionRate}%</TableCell>
                      <TableCell>{rep.totalOrders}</TableCell>
                      <TableCell>{rep.totalDeliveryFees.toFixed(2)}</TableCell>
                      <TableCell>{rep.totalSalesValue.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold text-primary">{rep.totalCommission.toFixed(2)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'}>
                            <DropdownMenuLabel>{UI_TEXT.actions[language]}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditRep(rep)}>{UI_TEXT.edit[language]}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteRep(rep.id)} className="text-destructive">{UI_TEXT.delete[language]}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {UI_TEXT.noReps[language]}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <DeliveryRepDialog 
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveRep}
        rep={editingRep}
        language={language}
      />
    </>
  );
};

export default DeliveryRepsTab;
