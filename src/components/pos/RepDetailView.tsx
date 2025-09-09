import * as React from 'react';
import type { Sale } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package, DollarSign, ArrowLeftRight, User, Phone, Percent } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type Language = 'en' | 'ar';

const UI_TEXT = {
  backToDashboard: { en: 'Back to Dashboard', ar: 'العودة للوحة التحكم' },
  repDetails: { en: 'Representative Details', ar: 'تفاصيل المندوب' },
  orders: { en: 'Orders', ar: 'الطلبات' },
  totalSales: { en: 'Total Sales', ar: 'إجمالي المبيعات' },
  totalCommission: { en: 'Total Commission', ar: 'إجمالي العمولة' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  commissionRate: { en: 'Commission Rate', ar: 'نسبة العمولة' },
  salesHistory: { en: 'Sales History', ar: 'سجل المبيعات' },
  transactionId: { en: 'Transaction ID', ar: 'رقم الفاتورة' },
  date: { en: 'Date', ar: 'التاريخ' },
  customer: { en: 'Customer', ar: 'العميل' },
  total: { en: 'Total', ar: 'الإجمالي' },
  commission: { en: 'Commission', ar: 'العمولة' },
  noSales: { en: 'No sales found for this representative in the selected period.', ar: 'لا توجد مبيعات لهذا المندوب في الفترة المحددة.' },
  walkIn: { en: 'Walk-in Customer', ar: 'عميل نقدي' },
};

interface RepDetailViewProps {
  repData: any;
  onBack: () => void;
  language: Language;
}

const RepDetailView: React.FC<RepDetailViewProps> = ({ repData, onBack, language }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{repData.name}</CardTitle>
            <CardDescription>{UI_TEXT.repDetails[language]}</CardDescription>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
            {UI_TEXT.backToDashboard[language]}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{UI_TEXT.orders[language]}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{repData.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{UI_TEXT.totalSales[language]}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{repData.totalSalesValue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{UI_TEXT.totalCommission[language]}</CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{repData.totalCommission.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Rep Info */}
         <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{UI_TEXT.repDetails[language]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium" dir="ltr">{repData.phone}</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <Percent className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{repData.commissionRate}%</span>
                    </div>
                </CardContent>
            </Card>
         </div>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>{UI_TEXT.salesHistory[language]}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-40rem)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{UI_TEXT.transactionId[language]}</TableHead>
                    <TableHead>{UI_TEXT.customer[language]}</TableHead>
                    <TableHead>{UI_TEXT.date[language]}</TableHead>
                    <TableHead className="text-end">{UI_TEXT.total[language]}</TableHead>
                    <TableHead className="text-end">{UI_TEXT.commission[language]}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repData.sales.length > 0 ? (
                    repData.sales.map((sale: Sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{sale.customer ? sale.customer.name : UI_TEXT.walkIn[language]}</TableCell>
                        <TableCell>{new Date(sale.createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</TableCell>
                        <TableCell className="text-end">{sale.finalTotal.toFixed(2)}</TableCell>
                        <TableCell className="text-end font-semibold text-primary">
                          {(sale.finalTotal * (repData.commissionRate / 100)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        {UI_TEXT.noSales[language]}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default RepDetailView;
