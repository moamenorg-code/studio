import * as React from 'react';
import type { Sale, Purchase, Expense, Language } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, ShoppingCart, Truck, Percent, HandCoins } from 'lucide-react';

type Language = 'en' | 'ar';

const UI_TEXT: Record<string, Record<Language, string>> = {
    reports: { en: 'Reports', ar: 'التقارير' },
    detailedReports: { en: 'Detailed reports for sales, purchases, and more.', ar: 'تقارير مفصلة للمبيعات والمشتريات والمزيد.' },
    sales: { en: 'Sales', ar: 'المبيعات' },
    purchases: { en: 'Purchases', ar: 'المشتريات' },
    discounts: { en: 'Discounts', ar: 'الخصومات' },
    deliveryFees: { en: 'Delivery Fees', ar: 'رسوم التوصيل' },
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
    deliveryFee: { en: 'Delivery Fee', ar: 'رسوم التوصيل' },
    noDeliveryFees: { en: 'No delivery fees recorded.', ar: 'لا توجد رسوم توصيل مسجلة.' },
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

const PurchasesReport: React.FC<{ purchases: Purchase[], language: Language }> = ({ purchases, language }) => (
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
                    <TableCell>Supplier ID: {purchase.supplierId}</TableCell>
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

const DeliveryFeesReport: React.FC<{ sales: Sale[], language: Language }> = ({ sales, language }) => {
    const deliverySales = sales.filter(s => s.orderType === 'delivery' && s.serviceCharge > 0);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{UI_TEXT.transactionId[language]}</TableHead>
                    <TableHead>{UI_TEXT.date[language]}</TableHead>
                    <TableHead className="text-right">{UI_TEXT.deliveryFee[language]}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {deliverySales.length > 0 ? deliverySales.map(sale => (
                    <TableRow key={sale.id}>
                        <TableCell>{sale.id}</TableCell>
                        <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">{sale.serviceCharge.toFixed(2)}</TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">{UI_TEXT.noDeliveryFees[language]}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};


interface ReportsTabProps {
    sales: Sale[];
    purchases: Purchase[];
    expenses: Expense[];
    language: Language;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ sales, purchases, expenses, language }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{UI_TEXT.reports[language]}</CardTitle>
                <CardDescription>{UI_TEXT.detailedReports[language]}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="sales" dir={language}>
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                        <TabsTrigger value="sales"><ShoppingCart className="w-4 h-4 me-2" />{UI_TEXT.sales[language]}</TabsTrigger>
                        <TabsTrigger value="purchases"><Truck className="w-4 h-4 me-2" />{UI_TEXT.purchases[language]}</TabsTrigger>
                        <TabsTrigger value="expenses"><FileText className="w-4 h-4 me-2" />{UI_TEXT.expenses[language]}</TabsTrigger>
                        <TabsTrigger value="discounts"><Percent className="w-4 h-4 me-2" />{UI_TEXT.discounts[language]}</TabsTrigger>
                        <TabsTrigger value="delivery"><HandCoins className="w-4 h-4 me-2" />{UI_TEXT.deliveryFees[language]}</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[calc(100vh-22rem)] mt-4">
                        <TabsContent value="sales">
                            <SalesReport sales={sales} language={language} />
                        </TabsContent>
                        <TabsContent value="purchases">
                            <PurchasesReport purchases={purchases} language={language} />
                        </TabsContent>
                         <TabsContent value="expenses">
                            <ExpensesReport expenses={expenses} language={language} />
                        </TabsContent>
                         <TabsContent value="discounts">
                            <DiscountsReport sales={sales} language={language} />
                        </TabsContent>
                         <TabsContent value="delivery">
                            <DeliveryFeesReport sales={sales} language={language} />
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default ReportsTab;
