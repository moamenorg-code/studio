import * as React from 'react';
import type { Sale, Product, Category, Recipe, RawMaterial, Language, OrderType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingCart, Users, Receipt } from 'lucide-react';

const UI_TEXT = {
    reportsDashboard: { en: 'Reports Dashboard', ar: 'لوحة تحكم التقارير' },
    overview: { en: 'Comprehensive overview of your business performance.', ar: 'نظرة عامة شاملة على أداء عملك.' },
    totalRevenue: { en: 'Total Revenue', ar: 'إجمالي الإيرادات' },
    netProfit: { en: 'Net Profit (Est.)', ar: 'صافي الربح (تقريبي)' },
    avgOrderValue: { en: 'Avg. Order Value', ar: 'متوسط قيمة الطلب' },
    totalOrders: { en: 'Total Orders', ar: 'إجمالي الطلبات' },
    salesAndProfit: { en: 'Sales and Profit Over Time', ar: 'المبيعات والأرباح عبر الزمن' },
    topSellingProducts: { en: 'Top 5 Selling Products (by Revenue)', ar: 'أفضل 5 منتجات مبيعًا (حسب الإيراد)' },
    topCategories: { en: 'Top 5 Categories (by Revenue)', ar: 'أفضل 5 فئات (حسب الإيراد)' },
    salesByType: { en: 'Sales by Order Type', ar: 'المبيعات حسب نوع الطلب' },
    sales: { en: 'Sales', ar: 'المبيعات' },
    profit: { en: 'Profit', ar: 'الربح' },
    product: { en: 'Product', ar: 'المنتج' },
    category: { en: 'Category', ar: 'الفئة' },
    revenue: { ar: 'الإيراد', en: 'Revenue' },
    quantity: { ar: 'الكمية', en: 'Quantity' },
    orderType: { ar: 'نوع الطلب', en: 'Order Type' },
    'dine-in': { en: 'Dine-in', ar: 'صالة' },
    takeaway: { en: 'Takeaway', ar: 'سفري' },
    delivery: { en: 'Delivery', ar: 'توصيل' },
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ReportsTabProps {
    sales: Sale[];
    products: Product[];
    categories: Category[];
    recipes: Recipe[];
    rawMaterials: RawMaterial[];
    language: Language;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ sales, products, categories, recipes, rawMaterials, language }) => {

    const calculateCostOfProduct = React.useCallback((productId: string): number => {
        const product = products.find(p => p.id === productId);
        if (!product || !product.recipeId) return 0;

        const recipe = recipes.find(r => r.id === product.recipeId);
        if (!recipe) return 0;

        // This is a simplification. In a real scenario, purchase prices of raw materials would be tracked.
        // Here we'll just assign a mock cost, maybe a % of the price, or find a better way if data is available.
        // For now, let's assume cost is 40% of the price for products with recipes.
        return product.price * 0.40;

    }, [products, recipes]);

    const processedData = React.useMemo(() => {
        const totalRevenue = sales.reduce((acc, sale) => acc + sale.finalTotal, 0);
        const totalOrders = sales.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        let totalCost = 0;
        const productPerformance: { [id: string]: { revenue: number, quantity: number, name: string, nameAr: string, categoryId?: number } } = {};

        sales.forEach(sale => {
            sale.items.forEach(item => {
                const cost = calculateCostOfProduct(item.id) * item.quantity;
                totalCost += cost;

                const revenue = item.price * item.quantity * (1 - (item.discount / 100));
                if (!productPerformance[item.id]) {
                    productPerformance[item.id] = { revenue: 0, quantity: 0, name: item.name, nameAr: item.nameAr, categoryId: item.categoryId };
                }
                productPerformance[item.id].revenue += revenue;
                productPerformance[item.id].quantity += item.quantity;
            });
        });

        const netProfit = totalRevenue - totalCost;

        const salesByDay = sales.reduce((acc, sale) => {
            const day = new Date(sale.createdAt).toISOString().split('T')[0];
            if (!acc[day]) {
                acc[day] = { date: day, sales: 0, profit: 0 };
            }
            acc[day].sales += sale.finalTotal;
            const saleCost = sale.items.reduce((sum, item) => sum + calculateCostOfProduct(item.id) * item.quantity, 0);
            acc[day].profit += (sale.finalTotal - saleCost);
            return acc;
        }, {} as { [key: string]: { date: string, sales: number, profit: number } });

        const sortedSalesByDay = Object.values(salesByDay).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const topProducts = Object.values(productPerformance).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

        const categoryPerformance = Object.values(productPerformance).reduce((acc, product) => {
            if (product.categoryId) {
                if (!acc[product.categoryId]) {
                    const category = categories.find(c => c.id === product.categoryId);
                    acc[product.categoryId] = { name: category?.name || 'N/A', nameAr: category?.nameAr || 'N/A', revenue: 0 };
                }
                acc[product.categoryId].revenue += product.revenue;
            }
            return acc;
        }, {} as { [id: number]: { name: string, nameAr: string, revenue: number } });

        const topCategories = Object.values(categoryPerformance).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

        const salesByType = sales.reduce((acc, sale) => {
            if (!acc[sale.orderType]) {
                acc[sale.orderType] = { name: UI_TEXT[sale.orderType][language], revenue: 0 };
            }
            acc[sale.orderType].revenue += sale.finalTotal;
            return acc;
        }, {} as { [key: string]: { name: string, revenue: number } });


        return {
            totalRevenue,
            netProfit,
            avgOrderValue,
            totalOrders,
            salesByDay: sortedSalesByDay,
            topProducts,
            topCategories,
            salesByType: Object.values(salesByType),
        };
    }, [sales, products, categories, calculateCostOfProduct, language]);

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{UI_TEXT.reportsDashboard[language]}</h2>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{UI_TEXT.totalRevenue[language]}</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{processedData.totalRevenue.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{UI_TEXT.netProfit[language]}</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{processedData.netProfit.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{UI_TEXT.totalOrders[language]}</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{processedData.totalOrders}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{UI_TEXT.avgOrderValue[language]}</CardTitle>
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{processedData.avgOrderValue.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>{UI_TEXT.salesAndProfit[language]}</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={processedData.salesByDay}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" name={UI_TEXT.sales[language]} stroke={COLORS[0]} />
                                    <Line type="monotone" dataKey="profit" name={UI_TEXT.profit[language]} stroke={COLORS[1]} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>{UI_TEXT.salesByType[language]}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie data={processedData.salesByType} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                                        {processedData.salesByType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
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
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{UI_TEXT.product[language]}</TableHead>
                                        <TableHead className="text-right">{UI_TEXT.quantity[language]}</TableHead>
                                        <TableHead className="text-right">{UI_TEXT.revenue[language]}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {processedData.topProducts.map(p => (
                                        <TableRow key={p.name}>
                                            <TableCell>{language === 'ar' ? p.nameAr : p.name}</TableCell>
                                            <TableCell className="text-right">{p.quantity}</TableCell>
                                            <TableCell className="text-right">{p.revenue.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{UI_TEXT.topCategories[language]}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{UI_TEXT.category[language]}</TableHead>
                                        <TableHead className="text-right">{UI_TEXT.revenue[language]}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {processedData.topCategories.map(c => (
                                        <TableRow key={c.name}>
                                            <TableCell>{language === 'ar' ? c.nameAr : c.name}</TableCell>
                                            <TableCell className="text-right">{c.revenue.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </ScrollArea>
    );
};

export default ReportsTab;
