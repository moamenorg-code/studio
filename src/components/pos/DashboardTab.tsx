import * as React from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sale } from '@/lib/types';

type Language = 'en' | 'ar';

const UI_TEXT = {
  salesOverview: { en: 'Sales Overview', ar: 'نظرة عامة على المبيعات' },
  topSelling: { en: 'Top Selling Products', ar: 'المنتجات الأكثر مبيعًا' },
  salesByDay: { en: 'Sales by Day', ar: 'المبيعات حسب اليوم' },
  totalSales: { en: 'Total Sales', ar: 'إجمالي المبيعات' },
  totalTransactions: { en: 'Total Transactions', ar: 'إجمالي العمليات' },
  avgTransaction: { en: 'Avg. Transaction Value', ar: 'متوسط قيمة العملية' },
};

interface DashboardTabProps {
  sales: Sale[];
  language: Language;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const CustomTooltip = ({ active, payload, label, language }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


const DashboardTab: React.FC<DashboardTabProps> = ({ sales, language }) => {
  const totalSales = React.useMemo(() => sales.reduce((sum, sale) => sum + sale.finalTotal, 0), [sales]);
  const totalTransactions = sales.length;
  const avgTransactionValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  const salesByDay = React.useMemo(() => {
    const data: { [key: string]: number } = {};
    sales.forEach(sale => {
      const day = new Date(sale.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' });
      if (!data[day]) {
        data[day] = 0;
      }
      data[day] += sale.finalTotal;
    });
    const weekDays = language === 'ar' 
      ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return weekDays.map(day => ({
        name: day,
        sales: data[day] || 0,
    }));
  }, [sales, language]);

  const topSellingProducts = React.useMemo(() => {
    const productCount: { [key: string]: { name: string, nameAr: string, quantity: number } } = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productCount[item.id]) {
          productCount[item.id] = { name: item.name, nameAr: item.nameAr, quantity: 0 };
        }
        productCount[item.id].quantity += item.quantity;
      });
    });
    return Object.values(productCount)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map(p => ({ name: language === 'ar' ? p.nameAr : p.name, quantity: p.quantity }));
  }, [sales, language]);

  return (
    <div className="grid gap-4 md:gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>{UI_TEXT.totalSales[language]}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalSales.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{UI_TEXT.totalTransactions[language]}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalTransactions}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{UI_TEXT.avgTransaction[language]}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{avgTransactionValue.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>{UI_TEXT.salesByDay[language]}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" reversed={language === 'ar'} tickLine={false} axisLine={false} />
              <YAxis orientation={language === 'ar' ? 'right' : 'left'} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip language={language} />} />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>{UI_TEXT.topSelling[language]}</CardTitle>
        </CardHeader>
        <CardContent>
           <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={topSellingProducts} layout="vertical" margin={{ right: language === 'ar' ? 20 : 0, left: language === 'ar' ? 0 : 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80} 
                tickLine={false} 
                axisLine={false} 
                orientation={language === 'ar' ? 'right' : 'left'}
              />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
              <Bar dataKey="quantity" layout="vertical" radius={[0, 4, 4, 0]}>
                 {topSellingProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
