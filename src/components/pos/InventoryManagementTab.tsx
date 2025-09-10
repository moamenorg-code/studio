import * as React from 'react';
import { MoreHorizontal, PlusCircle, Search, Archive, Package, AlertCircle, DollarSign, ChevronsUpDown } from 'lucide-react';
import type { RawMaterial } from '@/lib/types';
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
import RawMaterialDialog from './RawMaterialDialog';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


type Language = 'en' | 'ar';

const UI_TEXT = {
  manageInventory: { en: 'Inventory Management', ar: 'إدارة المخزون' },
  manageRawMaterials: { en: 'View, add, edit, and track your raw materials.', ar: 'عرض وإضافة وتعديل وتتبع المواد الخام.' },
  addRawMaterial: { en: 'Add Raw Material', ar: 'إضافة مادة خام' },
  name: { en: 'Name', ar: 'الاسم' },
  stock: { en: 'Stock', ar: 'الكمية المتاحة' },
  unit: { en: 'Unit', ar: 'الوحدة' },
  cost: { en: 'Unit Cost', ar: 'تكلفة الوحدة' },
  value: { en: 'Total Value', ar: 'القيمة الإجمالية' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  noRawMaterials: { en: 'No raw materials found.', ar: 'لم يتم العثور على مواد خام.' },
  searchPlaceholder: { en: 'Search by name or barcode...', ar: 'ابحث بالاسم أو الباركود...' },
  totalValue: { en: 'Total Inventory Value', ar: 'إجمالي قيمة المخزون' },
  totalItems: { en: 'Total Items', ar: 'إجمالي الأصناف' },
  lowStockItems: { en: 'Low Stock Items', ar: 'أصناف منخفضة المخزون' },
  allItems: { en: 'All Items', ar: 'كل الأصناف' },
  lowStock: { en: 'Low Stock', ar: 'مخزون منخفض' },
  summary: { en: 'Summary', ar: 'الملخص' },
  toggleSummary: { en: 'Toggle Summary', ar: 'إظهار/إخفاء الملخص' },
};

interface InventoryManagementTabProps {
  rawMaterials: RawMaterial[];
  onRawMaterialsChange: (rawMaterials: RawMaterial[]) => void;
  language: Language;
}

const InventoryManagementTab: React.FC<InventoryManagementTabProps> = ({ rawMaterials, onRawMaterialsChange, language }) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingRawMaterial, setEditingRawMaterial] = React.useState<RawMaterial | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(true);
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);

  const handleAdd = () => {
    setEditingRawMaterial(null);
    setDialogOpen(true);
  };

  const handleEdit = (material: RawMaterial) => {
    setEditingRawMaterial(material);
    setDialogOpen(true);
  };

  const handleDelete = (materialId: number) => {
    onRawMaterialsChange(rawMaterials.filter(m => m.id !== materialId));
  };
  
  const handleSave = (material: Omit<RawMaterial, 'id'> | RawMaterial) => {
    if ('id' in material && editingRawMaterial) {
      onRawMaterialsChange(rawMaterials.map(m => (m.id === material.id ? material : m)));
    } else {
      const newMaterial = { ...material, id: Date.now() };
      onRawMaterialsChange([...rawMaterials, newMaterial]);
    }
    setDialogOpen(false);
  };

  const { filteredRawMaterials, summaryStats } = React.useMemo(() => {
    let filtered = [...rawMaterials];

    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(material => 
          material.name.toLowerCase().includes(lowercasedQuery) ||
          material.nameAr.toLowerCase().includes(lowercasedQuery) ||
          (material.barcode && material.barcode.includes(lowercasedQuery))
        );
    }

    const totalValue = rawMaterials.reduce((sum, item) => sum + (item.stock * item.cost), 0);
    const lowStockItemsCount = rawMaterials.filter(item => item.stock <= item.lowStockThreshold).length;

    if (filter === 'low_stock') {
        filtered = filtered.filter(item => item.stock <= item.lowStockThreshold);
    }
    
    return {
        filteredRawMaterials: filtered,
        summaryStats: {
            totalValue,
            totalItems: rawMaterials.length,
            lowStockItems: lowStockItemsCount
        }
    }
  }, [rawMaterials, searchQuery, filter]);

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>{UI_TEXT.manageInventory[language]}</CardTitle>
          <CardDescription>{UI_TEXT.manageRawMaterials[language]}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
            {/* Summary Cards */}
            <Collapsible open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
                 <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between mb-4 text-lg font-semibold">
                         {UI_TEXT.summary[language]}
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">{UI_TEXT.toggleSummary[language]}</span>
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                     <div className="grid gap-4 md:grid-cols-3 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{UI_TEXT.totalValue[language]}</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summaryStats.totalValue.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{UI_TEXT.totalItems[language]}</CardTitle>
                                <Archive className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summaryStats.totalItems}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{UI_TEXT.lowStockItems[language]}</CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className={cn("text-2xl font-bold", summaryStats.lowStockItems > 0 ? "text-destructive" : "")}>{summaryStats.lowStockItems}</div>
                            </CardContent>
                        </Card>
                    </div>
                </CollapsibleContent>
            </Collapsible>
            
            {/* Actions and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={UI_TEXT.searchPlaceholder[language]}
                            className="ps-10"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="all">{UI_TEXT.allItems[language]}</TabsTrigger>
                            <TabsTrigger value="low_stock">
                                <AlertCircle className="w-4 h-4 me-2"/>
                                {UI_TEXT.lowStock[language]}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <Button onClick={handleAdd} className="w-full sm:w-auto">
                    <PlusCircle className="me-2 h-4 w-4" />
                    {UI_TEXT.addRawMaterial[language]}
                </Button>
            </div>
            
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{UI_TEXT.name[language]}</TableHead>
                  <TableHead className="text-center">{UI_TEXT.stock[language]}</TableHead>
                  <TableHead className="text-center">{UI_TEXT.unit[language]}</TableHead>
                  <TableHead className="text-center">{UI_TEXT.cost[language]}</TableHead>
                  <TableHead className="text-center">{UI_TEXT.value[language]}</TableHead>
                  <TableHead className="text-end">{UI_TEXT.actions[language]}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRawMaterials.length > 0 ? (
                  filteredRawMaterials.map(material => {
                    const isLowStock = material.stock <= material.lowStockThreshold;
                    return (
                        <TableRow 
                          key={material.id}
                          data-state={selectedRowId === material.id ? 'selected' : 'none'}
                          onClick={() => setSelectedRowId(material.id)}
                        >
                          <TableCell className="font-medium">{language === 'ar' ? material.nameAr : material.name}</TableCell>
                          <TableCell className={cn("text-center", isLowStock && "font-bold text-destructive")}>{material.stock}</TableCell>
                          <TableCell className="text-center">{material.unit}</TableCell>
                          <TableCell className="text-center">{material.cost.toFixed(2)}</TableCell>
                          <TableCell className="text-center font-semibold">{(material.stock * material.cost).toFixed(2)}</TableCell>
                          <TableCell className="text-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'}>
                                <DropdownMenuLabel>{UI_TEXT.actions[language]}</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEdit(material)}>{UI_TEXT.edit[language]}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(material.id)} className="text-destructive">{UI_TEXT.delete[language]}</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {UI_TEXT.noRawMaterials[language]}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
       <RawMaterialDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        rawMaterial={editingRawMaterial}
        language={language}
      />
    </>
  );
};

export default InventoryManagementTab;
