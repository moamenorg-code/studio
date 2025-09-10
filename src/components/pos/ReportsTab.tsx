import * as React from 'react';
import type { Sale, Purchase, Expense, Language, Supplier } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ShoppingCart, Truck, Percent, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

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
};

const SalesReport: React.FC<{ sales: Sale[], language: Language }> = ({ sales, language }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>{UI_TEXT.transactionId[language]}</TableHead>
                <TableHead>{UI_TEXT.date[language]}</TableHead>
                <TableHead>{UI_TEXT.customer[language]}</TableHead>
                <TableHead>{UI_TEXT.items[language]}</TableHead>
                <TableHead className="text-right">{UI_TEXT.total[language]}</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {sales.length > 0 ? sales.map(sale => (
                <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.customer?.name || UI_TEXT.walkIn[language]}</TableCell>
                    <TableCell>{sale.items.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
                    <TableCell className="text-right">{sale.finalTotal.toFixed(2)}</TableCell>
                </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">{UI_TEXT.noSales[language]}</TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
);

const PurchasesReport: React.FC<{ purchases: Purchase[], suppliers: Supplier[], language: Language }> = ({ purchases, suppliers, language }) => {
    const getSupplierName = (supplierId: number) => {
        return suppliers.find(s => s.id === supplierId)?.name || `ID: ${supplierId}`;
    };

    return (
     <Table>
        <TableHeader>
            <TableRow>
                <TableHead>{UI_TEXT.transactionId[language]}</TableHead>
                <TableHead>{UI_TEXT.date[language]}</TableHead>
                <TableHead>{UI_TEXT.supplier[language]}</TableHead>
                <TableHead className="text-right">{UI_TEXT.total[language]}</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {purchases.length > 0 ? purchases.map(purchase => (
                <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.id}</TableCell>
                    <TableCell>{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getSupplierName(purchase.supplierId)}</TableCell>
                    <TableCell className="text-right">{purchase.total.toFixed(2)}</TableCell>
                </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">{UI_TEXT.noPurchases[language]}</TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
    );
};

const ExpensesReport: React.FC<{ expenses: Expense[], language: Language }> = ({ expenses, language }) => (
    <Table>
       <TableHeader>
           <TableRow>
               <TableHead>{UI_TEXT.date[language]}</TableHead>
               <TableHead>{UI_TEXT.description[language]}</TableHead>
               <TableHead className="text-right">{UI_TEXT.amount[language]}</TableHead>
           </TableRow>
       </TableHeader>
       <TableBody>
           {expenses.length > 0 ? expenses.map(expense => (
               <TableRow key={expense.id}>
                   <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                   <TableCell>{expense.description}</TableCell>
                   <TableCell className="text-right">{expense.amount.toFixed(2)}</TableCell>
               </TableRow>
           )) : (
               <TableRow>
                   <TableCell colSpan={3} className="h-24 text-center">{UI_TEXT.noExpenses[language]}</TableCell>
               </TableRow>
           )}
       </TableBody>
   </Table>
);

const DiscountsReport: React.FC<{ sales: Sale[], language: Language }> = ({ sales, language }) => {
    const salesWithDiscount = sales.filter(s => s.totalDiscountValue > 0);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{UI_TEXT.transactionId[language]}</TableHead>
                    <TableHead>{UI_TEXT.date[language]}</TableHead>
                    <TableHead className="text-right">{UI_TEXT.discount[language]}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {salesWithDiscount.length > 0 ? salesWithDiscount.map(sale => (
                    <TableRow key={sale.id}>
                        <TableCell>{sale.id}</TableCell>
                        <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">{sale.totalDiscountValue.toFixed(2)}</TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">{UI_TEXT.noDiscounts[language]}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

interface ReportsTabProps {
    sales: Sale[];
    purchases: Purchase[];
    expenses: Expense[];
    suppliers: Supplier[];
    language: Language;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ sales, purchases, expenses, suppliers, language }) => {
    const totalSales = React.useMemo(() => sales.reduce((sum, sale) => sum + sale.finalTotal, 0), [sales]);
    const totalExpenses = React.useMemo(() => expenses.reduce((sum, expense) => sum + expense.amount, 0), [expenses]);
    const totalPurchases = React.useMemo(() => purchases.reduce((sum, purchase) => sum + purchase.total, 0), [purchases]);
    const totalDiscounts = React.useMemo(() => sales.reduce((sum, sale) => sum + sale.totalDiscountValue, 0), [sales]);
    const netProfit = totalSales - totalExpenses - totalPurchases;

    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader>
                    <CardTitle>{UI_TEXT.reports[language]}</CardTitle>
                    <CardDescription>{UI_TEXT.detailedReports[language]}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                </CardContent>
            </Card>

            <Tabs defaultValue="sales" dir={language}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="sales"><ShoppingCart className="w-4 h-4 me-2" />{UI_TEXT.sales[language]}</TabsTrigger>
                    <TabsTrigger value="purchases"><Truck className="w-4 h-4 me-2" />{UI_TEXT.purchases[language]}</TabsTrigger>
                    <TabsTrigger value="expenses"><FileText className="w-4 h-4 me-2" />{UI_TEXT.expenses[language]}</TabsTrigger>
                    <TabsTrigger value="discounts"><Percent className="w-4 h-4 me-2" />{UI_TEXT.discounts[language]}</TabsTrigger>
                </TabsList>
                <div className="mt-4 rounded-md border">
                    <ScrollArea className="h-[calc(100vh-32rem)]">
                        <TabsContent value="sales" className="m-0">
                            <SalesReport sales={sales} language={language} />
                        </TabsContent>
                        <TabsContent value="purchases" className="m-0">
                            <PurchasesReport purchases={purchases} suppliers={suppliers} language={language} />
                        </TabsContent>
                         <TabsContent value="expenses" className="m-0">
                            <ExpensesReport expenses={expenses} language={language} />
                        </TabsContent>
                         <TabsContent value="discounts" className="m-0">
                            <DiscountsReport sales={sales} language={language} />
                        </TabsContent>
                    </ScrollArea>
                </div>
            </Tabs>
        </div>
    );
};

export default ReportsTab;
