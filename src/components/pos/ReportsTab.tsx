import * as React from 'react';
import type { Sale, Product, Category, Recipe, User, OrderType, Language, RawMaterial } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Receipt, Users, ShoppingBag, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';
import { cn } from '@/lib/utils';

const UI_TEXT: Record<string, Record<Language, string>> = {
    reportsDashboard: { en: 'Reports Dashboard', ar: 'لوحة تحكم التقارير' },
    overview: { en: 'Comprehensive overview of your business performance.', ar: 'نظرة عامة شاملة على أداء عملك.' },
    totalRevenue: { en: 'Total Revenue', ar: 'إجمالي الإيرادات' },
    netProfit: { en: 'Net Profit (Est.)', ar: 'صافي الربح (تقريبي)' },
    totalOrders: { en: 'Total Orders', ar: 'إجمالي الطلبات' },
    paymentMethod: { en: 'Payment Method Breakdown', ar: 'توزيع طرق الدفع' },
    salesAndProfit: { en: 'Sales and Profit Over Time', ar: 'المبيعات والأرباح عبر الزمن' },
    topSellingProducts: { en: 'Top 5 Selling Products', ar: 'أفضل 5 منتجات مبيعًا' },
    topCategories: { en: 'Top 5 Categories', ar: 'أفضل 5 فئات' },
    salesByHour: { en: 'Sales by Hour of Day', ar: 'المبيعات حسب الساعة' },
    userPerformance: { en: 'Sales by User', ar: 'المبيعات حسب المستخدم' },
    sales: { en: 'Sales', ar: 'المبيعات' },
    profit: { en: 'Profit', ar: 'الربح' },
    product: { en: 'Product', ar: 'المنتج' },
    category: { en: 'Category', ar: 'الفئة' },
    revenue: { ar: 'الإيراد', en: 'Revenue' },
    quantity: { ar: 'الكمية', en: 'Quantity' },
    user: { en: 'User', ar: 'المستخدم' },
    dateRange: { en: 'Date Range', ar: 'النطاق الزمني' },
    today: { en: 'Today', ar: 'اليوم' },
    last7: { en: 'Last 7 Days', ar: 'آخر 7 أيام' },
    last30: { en: 'Last 30 Days', ar: 'آخر 30 يومًا' },
    custom: { en: 'Custom Range', ar: 'نطاق مخصص' },
    orderType: { en: 'Order Type', ar: 'نوع الطلب' },
    allTypes: { en: 'All Types', ar: 'كل الأنواع' },
    'dine-in': { en: 'Dine-in', ar: 'صالة' },
    takeaway: { en: 'Takeaway', ar: 'سفري' },
    delivery: { en: 'Delivery', ar: 'توصيل' },
    cash: { en: 'Cash', ar: 'نقدي' },
    card: { en: 'Card', ar: 'بطاقة' },
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#dd6d7f', '#a37e58'];

interface ReportsTabProps {
    sales: Sale[];
    products: Product[];
    categories: Category[];
    recipes: Recipe[];
    rawMaterials: RawMaterial[];
    users: User[];
    language: Language;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ sales, products, categories, recipes, rawMaterials, users, language }) => {
    const [dateRangeOption, setDateRangeOption] = React.useState<string>('last30');
    const [customDateRange, setCustomDateRange] = React.useState<DateRange | undefined>({ from: subDays(new Date(), 29), to: new Date() });
    const [orderTypeFilter, setOrderTypeFilter] = React.useState<OrderType | 'all'>('all');

    const handleDateRangeChange = (option: string) => {
        setDateRangeOption(option);
        if (option === 'today') setCustomDateRange({ from: new Date(), to: new Date() });
        else if (option === 'last7') setCustomDateRange({ from: subDays(new Date(), 6), to: new Date() });
        else if (option === 'last30') setCustomDateRange({ from: subDays(new Date(), 29), to: new Date() });
        else setCustomDateRange(undefined);
    };

    const filteredSales = React.useMemo(() => {
        let dateFiltered = sales;
        if (customDateRange?.from && customDateRange?.to) {
            const startDate = startOfDay(customDateRange.from);
            const endDate = endOfDay(customDateRange.to);
            dateFiltered = sales.filter(sale => {
                const saleDate = new Date(sale.createdAt);
                return saleDate >= startDate && saleDate <= endDate;
            });
        }

        if (orderTypeFilter !== 'all') {
            return dateFiltered.filter(sale => sale.orderType === orderTypeFilter);
        }
        
        return dateFiltered;
    }, [sales, customDateRange, orderTypeFilter]);
    
    const getCostOfSale = React.useCallback((sale: Sale): number => {
        return sale.items.reduce((totalCost, saleItem) => {
            const product = products.find(p => p.id === saleItem.id);
            if (!product || !product.recipeId) return totalCost;

            const recipe = recipes.find(r => r.id === product.recipeId);
            if (!recipe) return totalCost;

            const productCost = recipe.items.reduce((recipeCost, recipeItem) => {
                const material = rawMaterials.find(m => m.id === recipeItem.rawMaterialId);
                const materialCost = material?.cost || 0;
                return recipeCost + (recipeItem.quantity * materialCost);
            }, 0);

            return totalCost + (productCost * saleItem.quantity);
        }, 0);
    }, [products, recipes, rawMaterials]);


    const calculatedMetrics = React.useMemo(() => {
        const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.finalTotal, 0);
        const totalOrders = filteredSales.length;

        const totalCost = filteredSales.reduce((sum, sale) => {
            return sum + getCostOfSale(sale);
        }, 0);
        const netProfit = totalRevenue - totalCost;

        const paymentMethodData = filteredSales.reduce((acc, sale) => {
            acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.finalTotal;
            return acc;
        }, {} as Record<'cash' | 'card', number>);

        return { totalRevenue, totalOrders, netProfit, paymentMethodData };
    }, [filteredSales, getCostOfSale]);

    const salesOverTime = React.useMemo(() => {
        const grouped: Record<string, { sales: number; profit: number }> = {};
        filteredSales.forEach(sale => {
            const date = format(new Date(sale.createdAt), 'yyyy-MM-dd');
            if (!grouped[date]) grouped[date] = { sales: 0, profit: 0 };
            
            const cost = getCostOfSale(sale);

            grouped[date].sales += sale.finalTotal;
            grouped[date].profit += sale.finalTotal - cost;
        });
        return Object.entries(grouped).map(([date, values]) => ({ date, ...values })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [filteredSales, getCostOfSale]);

    const topProducts = React.useMemo(() => {
        const productSales: Record<string, { name: string, nameAr: string, revenue: number, quantity: number }> = {};
        filteredSales.forEach(sale => {
            sale.items.forEach(item => {
                if (!productSales[item.id]) {
                    const product = products.find(p => p.id === item.id);
                    productSales[item.id] = { name: product?.name || '', nameAr: product?.nameAr || '', revenue: 0, quantity: 0 };
                }
                productSales[item.id].revenue += item.price * item.quantity;
                productSales[item.id].quantity += item.quantity;
            });
        });
        return Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    }, [filteredSales, products]);
    
    const topCategories = React.useMemo(() => {
        const categorySales: Record<string, { name: string; nameAr: string; revenue: number }> = {};
        filteredSales.forEach(sale => {
            sale.items.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product?.categoryId) {
                    const category = categories.find(c => c.id === product.categoryId);
                    if (category) {
                        if (!categorySales[category.id]) {
                            categorySales[category.id] = { name: category.name, nameAr: category.nameAr, revenue: 0 };
                        }
                        categorySales[category.id].revenue += item.price * item.quantity;
                    }
                }
            });
        });
        return Object.values(categorySales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    }, [filteredSales, products, categories]);

    const salesByHour = React.useMemo(() => {
        const hourlySales = Array(24).fill(0).map(() => ({ sales: 0 }));
        filteredSales.forEach(sale => {
            const hour = new Date(sale.createdAt).getHours();
            hourlySales[hour].sales += sale.finalTotal;
        });
        return hourlySales.map((data, index) => ({ hour: `${index}:00`, ...data }));
    }, [filteredSales]);
    
    const salesByUser = React.useMemo(() => {
        const userSales: Record<string, { name: string, sales: number }> = {};
        filteredSales.forEach(sale => {
            if (sale.userId) {
                const user = users.find(u => u.id === sale.userId);
                if (user) {
                    if (!userSales[user.id]) {
                        userSales[user.id] = { name: user.name, sales: 0 };
                    }
                    userSales[user.id].sales += sale.finalTotal;
                }
            }
        });
        return Object.values(userSales).sort((a, b) => b.sales - a.sales);
    }, [filteredSales, users]);

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-1">
                <Card>
                    <CardHeader>
                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>{UI_TEXT.reportsDashboard[language]}</CardTitle>
                                <CardDescription>{UI_TEXT.overview[language]}</CardDescription>
                            </div>
                            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
                                <Select value={dateRangeOption} onValueChange={handleDateRangeChange}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder={UI_TEXT.dateRange[language]} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="today">{UI_TEXT.today[language]}</SelectItem>
                                        <SelectItem value="last7">{UI_TEXT.last7[language]}</SelectItem>
                                        <SelectItem value="last30">{UI_TEXT.last30[language]}</SelectItem>
                                        <SelectItem value="custom">{UI_TEXT.custom[language]}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {dateRangeOption === 'custom' && (
                                     <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full sm:w-[300px] justify-start text-left font-normal", !customDateRange && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {customDateRange?.from ? (
                                                customDateRange.to ? (
                                                <>
                                                    {format(customDateRange.from, "LLL dd, y")} - {format(customDateRange.to, "LLL dd, y")}
                                                </>
                                                ) : (
                                                format(customDateRange.from, "LLL dd, y")
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="end">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={customDateRange?.from}
                                            selected={customDateRange}
                                            onSelect={setCustomDateRange}
                                            numberOfMonths={2}
                                        />
                                        </PopoverContent>
                                    </Popover>
                                )}
                                <Select value={orderTypeFilter} onValueChange={(val) => setOrderTypeFilter(val as any)}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder={UI_TEXT.orderType[language]} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{UI_TEXT.allTypes[language]}</SelectItem>
                                        <SelectItem value="dine-in">{UI_TEXT['dine-in'][language]}</SelectItem>
                                        <SelectItem value="takeaway">{UI_TEXT.takeaway[language]}</SelectItem>
                                        <SelectItem value="delivery">{UI_TEXT.delivery[language]}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{UI_TEXT.totalRevenue[language]}</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{calculatedMetrics.totalRevenue.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{UI_TEXT.netProfit[language]}</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{calculatedMetrics.netProfit.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{UI_TEXT.totalOrders[language]}</CardTitle>
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{calculatedMetrics.totalOrders}</div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>{UI_TEXT.salesAndProfit[language]}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={salesOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" name={UI_TEXT.sales[language]} stroke={COLORS[0]} />
                                    <Line type="monotone" dataKey="profit" name={UI_TEXT.profit[language]} stroke={COLORS[1]} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                         <CardHeader>
                            <CardTitle>{UI_TEXT.paymentMethod[language]}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie data={Object.entries(calculatedMetrics.paymentMethodData).map(([name, value]) => ({ name: UI_TEXT[name as 'cash' | 'card'][language], value }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {Object.keys(calculatedMetrics.paymentMethodData).map((key, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{UI_TEXT.topSellingProducts[language]}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topProducts} layout="vertical" margin={{ left: 50 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" width={100} dataKey={language === 'ar' ? 'nameAr' : 'name'} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="revenue" name={UI_TEXT.revenue[language]} fill={COLORS[0]} />
                                    <Bar dataKey="quantity" name={UI_TEXT.quantity[language]} fill={COLORS[1]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{UI_TEXT.topCategories[language]}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topCategories} layout="vertical" margin={{ left: 50 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" width={100} dataKey={language === 'ar' ? 'nameAr' : 'name'} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="revenue" name={UI_TEXT.revenue[language]} fill={COLORS[2]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                 <Card>
                    <CardHeader>
                        <CardTitle>{UI_TEXT.salesByHour[language]}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesByHour}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" name={UI_TEXT.sales[language]} fill={COLORS[3]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle>{UI_TEXT.userPerformance[language]}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{UI_TEXT.user[language]}</TableHead>
                                    <TableHead className="text-right">{UI_TEXT.sales[language]}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {salesByUser.map(user => (
                                    <TableRow key={user.name}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell className="text-right">{user.sales.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
};

export default ReportsTab;
