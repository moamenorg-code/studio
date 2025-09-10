import * as React from 'react';
import type { Sale, Purchase, Expense, Language, Supplier, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ShoppingCart, Truck, Percent, TrendingUp, TrendingDown, DollarSign, ChevronsUpDown, Table as TableIcon, Bike, Package, User as UserIcon, Calendar as CalendarIcon } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';


type Language = 'en' | 'ar';

const UI_TEXT: Record<string, Record<Language, string>> = {
    reports: { en: 'Financial Reports', ar: 'التقارير المالية' },
    detailedReports: { en: 'Detailed financial analysis of your operations.', ar: 'تحليل مالي مفصل لعملياتك.' },
    sales: { en: 'Sales', ar: 'المبيعات' },
    purchases: { en: 'Purchases', ar: 'المشتريات' },
    discounts: { en: 'Discounts', ar: 'الخصومات' },
    expenses: { en: 'Expenses', ar: 'المصروفات' },
    transactionId: { en: 'Transaction ID', ar: 'رقم الفاتورة' },
    date: { en: 'Date', ar: 'التاريخ' },
    customer: { en: 'Customer', ar: 'العميل' },
    items: { en: 'Items', ar: 'الأصناف' },
    total: { en: 'Total', ar: 'الإجمالي' },
    noSales: { en: 'No sales found.', ar: 'لا توجد مبيعات.' },
    walkIn: { en: 'Walk-in Customer', ar: 'عميل نقدي' },
    supplier: { en: 'Supplier', ar: 'المورد' },
    noPurchases: { en: 'No purchases found.', ar: 'لا توجد مشتريات.' },
    description: { en: 'Description', ar: 'الوصف' },
    amount: { en: 'Amount', ar: 'المبلغ' },
    noExpenses: { en: 'No expenses found.', ar: 'لا توجد مصروفات.' },
    discount: { en: 'Discount', ar: 'الخصم' },
    noDiscounts: { en: 'No discounts recorded.', ar: 'لا توجد خصومات مسجلة.' },
    totalSales: { en: 'Total Sales', ar: 'إجمالي المبيعات' },
    totalExpenses: { en: 'Total Expenses', ar: 'إجمالي المصروفات' },
    netProfit: { en: 'Net Profit', ar: 'صافي الربح' },
    totalDiscounts: { en: 'Total Discounts', ar: 'إجمالي الخصومات' },
    summary: { en: 'Summary', ar: 'الملخص' },
    toggleSummary: { en: 'Toggle Summary', ar: 'إظهار/إخفاء الملخص' },
    subtotal: { en: 'Subtotal', ar: 'المجموع الفرعي' },
    serviceCharge: { en: 'Service Charge', ar: 'رسوم الخدمة' },
    orderType: { en: 'Order Type', ar: 'نوع الطلب' },
    paymentMethod: { en: 'Payment', ar: 'الدفع' },
    shiftId: { en: 'Shift ID', ar: 'معرف الشفت' },
    cash: { en: 'Cash', ar: 'نقدي' },
    card: { en: 'Card', ar: 'بطاقة' },
    'dine-in': { en: 'Dine-in', ar: 'طاولة' },
    takeaway: { en: 'Takeaway', ar: 'سفري' },
    delivery: { en: 'Delivery', ar: 'توصيل' },
    user: { en: 'User', ar: 'الموظف' },
    unknownUser: { en: 'Unknown User', ar: 'موظف غير معروف' },
    pickDate: { en: 'Pick a date range', ar: 'اختر نطاقًا زمنيًا' },
};

const OrderTypeBadge: React.FC<{ type: Sale['orderType'], orderId: number, language: Language }> = ({ type, orderId, language }) => {
    let icon = <Package size={14} />;
    let text = UI_TEXT[type][language];
    
    if (type === 'dine-in') {
      icon = <TableIcon size={14} />;
      text = `${text} ${orderId}`;
    } else if (type === 'delivery') {
      icon = <Bike size={14} />;
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1 w-fit">
        {icon}
        {text}
      </Badge>
    );
};

const SalesReport: React.FC<{ sales: Sale[], users: User[], language: Language }> = ({ sales, users, language }) => {
    const getUserName = (userId?: number) => {
        if (!userId) return UI_TEXT.unknownUser[language];
        return users.find(u => u.id === userId)?.name || UI_TEXT.unknownUser[language];
    };
    
    return (
        <div className="overflow-x-auto">
            <Table className="min-w-max">
                <TableHeader>
                    <TableRow>
                        <TableHead>{UI_TEXT.transactionId[language]}</TableHead>
                        <TableHead>{UI_TEXT.date[language]}</TableHead>
                        <TableHead>{UI_TEXT.customer[language]}</TableHead>
                        <TableHead>{UI_TEXT.user[language]}</TableHead>
                        <TableHead>{UI_TEXT.items[language]}</TableHead>
                        <TableHead>{UI_TEXT.orderType[language]}</TableHead>
                        <TableHead>{UI_TEXT.paymentMethod[language]}</TableHead>
                        <TableHead className="text-right">{UI_TEXT.subtotal[language]}</TableHead>
                        <TableHead className="text-right">{UI_TEXT.discount[language]}</TableHead>
                        <TableHead className="text-right">{UI_TEXT.serviceCharge[language]}</TableHead>
                        <TableHead className="text-right font-bold">{UI_TEXT.total[language]}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sales.length > 0 ? sales.map(sale => (
                        <TableRow key={sale.id}>
                            <TableCell className="font-medium">{sale.id}</TableCell>
                            <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{sale.customer?.name || UI_TEXT.walkIn[language]}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                    <UserIcon size={14}/>
                                    {getUserName(sale.userId)}
                                </Badge>
                            </TableCell>
                            <TableCell>{sale.items.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
                            <TableCell><OrderTypeBadge type={sale.orderType} orderId={sale.orderId} language={language}/></TableCell>
                            <TableCell><Badge variant={sale.paymentMethod === 'cash' ? 'secondary' : 'default'}>{UI_TEXT[sale.paymentMethod][language]}</Badge></TableCell>
                            <TableCell className="text-right">{sale.subtotal.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-red-600">{sale.totalDiscountValue.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{sale.serviceCharge.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-bold">{sale.finalTotal.toFixed(2)}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={11} className="h-24 text-center">{UI_TEXT.noSales[language]}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

const PurchasesReport: React.FC<{ purchases: Purchase[], suppliers: Supplier[], language: Language }> = ({ purchases, suppliers, language }) => {
    const getSupplierName = (supplierId: number) => {
        return suppliers.find(s => s.id === supplierId)?.name || `ID: ${supplierId}`;
    };

    return (
     <div className="overflow-x-auto">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{UI_TEXT.transactionId[language]}</TableHead>
                    <TableHead>{UI_TEXT.date[language]}</TableHead>
                    <TableHead>{UI_TEXT.supplier[language]}</TableHead>
                    <TableHead className="text-center">{UI_TEXT.items[language]}</TableHead>
                    <TableHead className="text-right">{UI_TEXT.total[language]}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {purchases.length > 0 ? purchases.map(purchase => (
                    <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.id}</TableCell>
                        <TableCell>{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{getSupplierName(purchase.supplierId)}</TableCell>
                        <TableCell className="text-center">{purchase.items.length}</TableCell>
                        <TableCell className="text-right">{purchase.total.toFixed(2)}</TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">{UI_TEXT.noPurchases[language]}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
     </div>
    );
};

const ExpensesReport: React.FC<{ expenses: Expense[], language: Language }> = ({ expenses, language }) => (
    <div className="overflow-x-auto">
        <Table>
        <TableHeader>
            <TableRow>
                <TableHead>{UI_TEXT.date[language]}</TableHead>
                <TableHead>{UI_TEXT.shiftId[language]}</TableHead>
                <TableHead>{UI_TEXT.description[language]}</TableHead>
                <TableHead className="text-right">{UI_TEXT.amount[language]}</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {expenses.length > 0 ? expenses.map(expense => (
                <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.shiftId}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="text-right">{expense.amount.toFixed(2)}</TableCell>
                </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">{UI_TEXT.noExpenses[language]}</TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
    </div>
);

const DiscountsReport: React.FC<{ sales: Sale[], language: Language }> = ({ sales, language }) => {
    const salesWithDiscount = sales.filter(s => s.totalDiscountValue > 0);
    return (
       <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{UI_TEXT.transactionId[language]}</TableHead>
                        <TableHead>{UI_TEXT.date[language]}</TableHead>
                        <TableHead>{UI_TEXT.customer[language]}</TableHead>
                        <TableHead className="text-right">{UI_TEXT.discount[language]}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {salesWithDiscount.length > 0 ? salesWithDiscount.map(sale => (
                        <TableRow key={sale.id}>
                            <TableCell>{sale.id}</TableCell>
                            <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{sale.customer?.name || UI_TEXT.walkIn[language]}</TableCell>
                            <TableCell className="text-right">{sale.totalDiscountValue.toFixed(2)}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">{UI_TEXT.noDiscounts[language]}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
       </div>
    );
}

interface ReportsTabProps {
    sales: Sale[];
    purchases: Purchase[];
    expenses: Expense[];
    suppliers: Supplier[];
    users: User[];
    language: Language;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ sales, purchases, expenses, suppliers, users, language }) => {
    const [isSummaryOpen, setIsSummaryOpen] = React.useState(true);
    const [date, setDate] = React.useState<DateRange | undefined>()

    const { filteredSales, filteredPurchases, filteredExpenses } = React.useMemo(() => {
        if (!date || !date.from) {
            return { filteredSales: sales, filteredPurchases: purchases, filteredExpenses: expenses };
        }

        const from = date.from;
        const to = date.to ? new Date(date.to.setHours(23, 59, 59, 999)) : new Date(from.setHours(23, 59, 59, 999));

        const fs = sales.filter(s => {
            const saleDate = new Date(s.createdAt);
            return saleDate >= from && saleDate <= to;
        });

        const fp = purchases.filter(p => {
            const purchaseDate = new Date(p.createdAt);
            return purchaseDate >= from && purchaseDate <= to;
        });

        const fe = expenses.filter(e => {
            const expenseDate = new Date(e.createdAt);
            return expenseDate >= from && expenseDate <= to;
        });

        return { filteredSales: fs, filteredPurchases: fp, filteredExpenses: fe };
    }, [date, sales, purchases, expenses]);


    const totalSales = React.useMemo(() => filteredSales.reduce((sum, sale) => sum + sale.finalTotal, 0), [filteredSales]);
    const totalPurchases = React.useMemo(() => filteredPurchases.reduce((sum, purchase) => sum + purchase.total, 0), [filteredPurchases]);
    const totalExpenses = React.useMemo(() => filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0), [filteredExpenses]);
    const totalDiscounts = React.useMemo(() => filteredSales.reduce((sum, sale) => sum + sale.totalDiscountValue, 0), [filteredSales]);
    const netProfit = totalSales - totalExpenses - totalPurchases;

    return (
        <div className='space-y-6 flex flex-col'>
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>{UI_TEXT.reports[language]}</CardTitle>
                        <CardDescription>{UI_TEXT.detailedReports[language]}</CardDescription>
                    </div>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                            >
                                <CalendarIcon className="me-2 h-4 w-4" />
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
                </CardHeader>
                <CardContent>
                    <Collapsible open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between mb-4 text-lg font-semibold">
                                {UI_TEXT.summary[language]}
                                <ChevronsUpDown className="h-4 w-4" />
                                <span className="sr-only">{UI_TEXT.toggleSummary[language]}</span>
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{UI_TEXT.totalSales[language]}</CardTitle>
                                        <TrendingUp className="h-4 w-4 text-muted-foreground text-green-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{totalSales.toFixed(2)}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{UI_TEXT.totalExpenses[language]}</CardTitle>
                                        <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{totalExpenses.toFixed(2)}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{UI_TEXT.netProfit[language]}</CardTitle>
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {netProfit.toFixed(2)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{UI_TEXT.totalDiscounts[language]}</CardTitle>
                                        <Percent className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{totalDiscounts.toFixed(2)}</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </CardContent>
            </Card>

            <Tabs defaultValue="sales" dir={language} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="sales"><ShoppingCart className="w-4 h-4 me-2" />{UI_TEXT.sales[language]}</TabsTrigger>
                    <TabsTrigger value="purchases"><Truck className="w-4 h-4 me-2" />{UI_TEXT.purchases[language]}</TabsTrigger>
                    <TabsTrigger value="expenses"><FileText className="w-4 h-4 me-2" />{UI_TEXT.expenses[language]}</TabsTrigger>
                    <TabsTrigger value="discounts"><Percent className="w-4 h-4 me-2" />{UI_TEXT.discounts[language]}</TabsTrigger>
                </TabsList>
                <div className="mt-4 rounded-md border flex-1 overflow-auto">
                    <TabsContent value="sales" className="m-0 h-full">
                        <SalesReport sales={filteredSales} users={users} language={language} />
                    </TabsContent>
                    <TabsContent value="purchases" className="m-0 h-full">
                        <PurchasesReport purchases={filteredPurchases} suppliers={suppliers} language={language} />
                    </TabsContent>
                      <TabsContent value="expenses" className="m-0 h-full">
                        <ExpensesReport expenses={filteredExpenses} language={language} />
                    </TabsContent>
                      <TabsContent value="discounts" className="m-0 h-full">
                        <DiscountsReport sales={filteredSales} language={language} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default ReportsTab;
