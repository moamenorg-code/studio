import * as React from 'react';
import type { Sale } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table as TableIcon, Package, Bike } from 'lucide-react';

type Language = 'en' | 'ar';

const UI_TEXT = {
  salesHistory: { en: 'Sales History', ar: 'سجل المبيعات' },
  allTransactions: { en: 'A list of all sales transactions.', ar: 'قائمة بجميع عمليات البيع.' },
  transactionId: { en: 'Transaction ID', ar: 'معرف العملية' },
  date: { en: 'Date', ar: 'التاريخ' },
  customer: { en: 'Customer', ar: 'العميل' },
  orderType: { en: 'Order Type', ar: 'نوع الطلب' },
  total: { en: 'Total', ar: 'الإجمالي' },
  paymentMethod: { en: 'Payment Method', ar: 'طريقة الدفع' },
  noSales: { en: 'No sales yet.', ar: 'لا توجد مبيعات بعد.' },
  cash: { en: 'Cash', ar: 'نقدي' },
  card: { en: 'Card', ar: 'بطاقة' },
  walkIn: { en: 'Walk-in Customer', ar: 'عميل نقدي' },
  'dine-in': { en: 'Dine-in', ar: 'طاولة' },
  takeaway: { en: 'Takeaway', ar: 'سفري' },
  delivery: { en: 'Delivery', ar: 'توصيل' },
};

interface SalesHistoryTabProps {
  sales: Sale[];
  language: Language;
}

const SalesHistoryTab: React.FC<SalesHistoryTabProps> = ({ sales, language }) => {
  const formatPaymentMethod = (method: 'cash' | 'card') => {
    return UI_TEXT[method][language];
  };
  
  const OrderTypeBadge = ({ type, orderId }: { type: Sale['orderType'], orderId: number }) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{UI_TEXT.salesHistory[language]}</CardTitle>
        <CardDescription>{UI_TEXT.allTransactions[language]}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-14rem)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{UI_TEXT.transactionId[language]}</TableHead>
                <TableHead>{UI_TEXT.customer[language]}</TableHead>
                <TableHead>{UI_TEXT.orderType[language]}</TableHead>
                <TableHead>{UI_TEXT.date[language]}</TableHead>
                <TableHead>{UI_TEXT.paymentMethod[language]}</TableHead>
                <TableHead className="text-end">{UI_TEXT.total[language]}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {UI_TEXT.noSales[language]}
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.customer ? sale.customer.name : UI_TEXT.walkIn[language]}</TableCell>
                    <TableCell>
                      <OrderTypeBadge type={sale.orderType} orderId={sale.orderId} />
                    </TableCell>
                    <TableCell>
                      {new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                      }).format(sale.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sale.paymentMethod === 'card' ? 'default' : 'secondary'}>
                        {formatPaymentMethod(sale.paymentMethod)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-end">{sale.finalTotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SalesHistoryTab;
