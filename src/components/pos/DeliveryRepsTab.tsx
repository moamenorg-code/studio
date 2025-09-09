import * as React from 'react';
import { MoreHorizontal, PlusCircle, Calendar as CalendarIcon, ArrowLeftRight, Package, DollarSign } from 'lucide-react';
import type { DeliveryRep, Sale, Shift, Settings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import RepDetailView from './RepDetailView';


type Language = 'en' | 'ar';

const UI_TEXT = {
  manageReps: { en: 'Delivery Reps Dashboard', ar: 'لوحة تحكم مندوبي التوصيل' },
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
  totalDeliveryOrders: { en: 'Total Delivery Orders', ar: 'إجمالي طلبات التوصيل' },
  totalDeliverySales: { en: 'Total Delivery Sales', ar: 'إجمالي مبيعات التوصيل' },
  totalCommissionsPaid: { en: 'Total Commissions', ar: 'إجمالي العمولات' },
};

interface RepCardProps {
    rep: any;
    language: Language;
    onEdit: (rep: DeliveryRep) => void;
    onDelete: (id: number) => void;
    onSelect: (id: number) => void;
}

const RepCard: React.FC<RepCardProps> = ({ rep, language, onEdit, onDelete, onSelect }) => (
    <Card onClick={() => onSelect(rep.id)} className="cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">{rep.name}</CardTitle>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'}>
                <DropdownMenuLabel>{UI_TEXT.actions[language]}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(rep)}>{UI_TEXT.edit[language]}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(rep.id)} className="text-destructive">{UI_TEXT.delete[language]}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground" dir="ltr">{rep.phone}</p>
             <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">{UI_TEXT.orders[language]}</p>
                    <p className="text-xl font-bold">{rep.totalOrders}</p>
                </div>
                 <div className="rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">{UI_TEXT.commission[language]}</p>
                    <p className="text-xl font-bold">{rep.commissionRate}%</p>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">{UI_TEXT.totalSales[language]}</span>
                    <span className="font-semibold">{rep.totalSalesValue.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">{UI_TEXT.totalDelivery[language]}</span>
                    <span className="font-semibold">{rep.totalDeliveryFees.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between items-baseline text-primary font-bold text-md">
                    <span>{UI_TEXT.totalCommission[language]}</span>
                    <span>{rep.totalCommission.toFixed(2)}</span>
                </div>
             </div>
        </CardContent>
    </Card>
)

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
  const [selectedRepId, setSelectedRepId] = React.useState<number | null>(null);

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
    let salesToFilter = sales.filter(s => s.orderType === 'delivery' && s.deliveryRepId);
    
    if (selectedShiftId === 'current' && activeShift) {
       salesToFilter = salesToFilter.filter(s => new Date(s.createdAt) >= activeShift.startTime);
    } else if (selectedShiftId !== 'all' && selectedShiftId !== 'current') {
       const shift = shifts.find(s => String(s.id) === selectedShiftId);
       if (shift && shift.endTime) {
            salesToFilter = salesToFilter.filter(s => new Date(s.createdAt) >= shift.startTime && new Date(s.createdAt) <= shift.endTime!);
       }
    }

    if (date?.from && date?.to) {
        const toDate = new Date(date.to);
        toDate.setHours(23, 59, 59, 999); // Include the whole end day
        salesToFilter = salesToFilter.filter(s => new Date(s.createdAt) >= date.from! && new Date(s.createdAt) <= toDate);
    }
    
    return salesToFilter;

  }, [sales, activeShift, selectedShiftId, shifts, date]);

  const { repStats, summaryStats } = React.useMemo(() => {
      const stats = reps.map(rep => {
          const repSales = filteredSales.filter(sale => sale.deliveryRepId === rep.id);
          const totalOrders = repSales.length;
          const totalSalesValue = repSales.reduce((sum, sale) => sum + sale.finalTotal, 0);
          const totalDeliveryFees = repSales.reduce((sum, sale) => sum + sale.serviceCharge, 0);
          const totalCommission = totalSalesValue * (rep.commissionRate / 100);

          return {
              ...rep,
              totalOrders,
              totalSalesValue,
              totalDeliveryFees,
              totalCommission
          }
      });

      const summary = {
          totalOrders: filteredSales.length,
          totalSales: filteredSales.reduce((sum, sale) => sum + sale.finalTotal, 0),
          totalCommissions: stats.reduce((sum, rep) => sum + rep.totalCommission, 0)
      }

      return { repStats: stats, summaryStats: summary };
  }, [reps, filteredSales]);
  
  const selectedRepData = React.useMemo(() => {
      if (selectedRepId === null) return null;
      const repDetails = repStats.find(r => r.id === selectedRepId);
      const repSales = filteredSales.filter(s => s.deliveryRepId === selectedRepId);
      return {
          ...repDetails,
          sales: repSales
      }
  }, [selectedRepId, repStats, filteredSales]);

  if (selectedRepData) {
      return (
          <RepDetailView 
              repData={selectedRepData}
              onBack={() => setSelectedRepId(null)}
              language={language}
          />
      )
  }

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
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{UI_TEXT.totalDeliveryOrders[language]}</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryStats.totalOrders}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{UI_TEXT.totalDeliverySales[language]}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryStats.totalSales.toFixed(2)}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{UI_TEXT.totalCommissionsPaid[language]}</CardTitle>
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{summaryStats.totalCommissions.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>
          <ScrollArea className="h-[calc(100vh-32rem)]">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repStats.length > 0 ? (
                  repStats.map(rep => (
                    <RepCard 
                        key={rep.id} 
                        rep={rep} 
                        language={language} 
                        onEdit={handleEditRep} 
                        onDelete={handleDeleteRep} 
                        onSelect={setSelectedRepId}
                    />
                  ))
                ) : (
                    <div className="col-span-full h-24 text-center flex items-center justify-center">
                        <p>{UI_TEXT.noReps[language]}</p>
                    </div>
                )}
              </div>
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
