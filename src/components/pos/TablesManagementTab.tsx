import * as React from 'react';
import { MoreHorizontal, PlusCircle, Edit, Trash2, ShoppingCart, XCircle, Table as TableIcon } from 'lucide-react';
import type { Table, CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageTables: { en: 'Manage Tables', ar: 'إدارة الطاولات' },
  viewAndManageTables: { en: 'View and manage your tables.', ar: 'عرض وإدارة طاولاتك.' },
  addTable: { en: 'Add Table', ar: 'إضافة طاولة' },
  editTable: { en: 'Edit Table', ar: 'تعديل الطاولة' },
  tableName: { en: 'Table Name', ar: 'اسم الطاولة' },
  save: { en: 'Save', ar: 'حفظ' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  delete: { en: 'Delete', ar: 'حذف' },
  available: { en: 'Available', ar: 'متاحة' },
  occupied: { en: 'Occupied', ar: 'مشغولة' },
  items: { en: 'items', ar: 'أصناف' },
  total: { en: 'Total', ar: 'الإجمالي' },
  viewOrder: { en: 'View Order', ar: 'عرض الطلب' },
  newOrder: { en: 'New Order', ar: 'طلب جديد' },
};

interface TableDialogProps {
  onSave: (name: string) => void;
  table?: Table | null;
  language: Language;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const TableDialog: React.FC<TableDialogProps> = ({ onSave, table, language, children, isOpen, onOpenChange }) => {
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    if(isOpen) {
      setName(table?.name || '');
    }
  }, [isOpen, table]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{table ? UI_TEXT.editTable[language] : UI_TEXT.addTable[language]}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="table-name">{UI_TEXT.tableName[language]}</Label>
          <Input
            id="table-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{UI_TEXT.cancel[language]}</Button>
          <Button onClick={handleSave}>{UI_TEXT.save[language]}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


interface TableCardProps {
    table: Table;
    isActive: boolean;
    onSelect: (id: number) => void;
    onOpenCart: () => void;
    onEdit: (table: Table) => void;
    language: Language;
}

const TableCard: React.FC<TableCardProps> = ({ table, isActive, onSelect, onOpenCart, onEdit, language }) => {
    const isOccupied = table.cart.length > 0;
    const total = table.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = table.cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleCardClick = () => {
        onSelect(table.id);
        if (isOccupied) {
            onOpenCart();
        }
    }

    return (
        <Card 
            className={cn(
                "cursor-pointer transition-all duration-200 ease-in-out relative group/table-card",
                isActive ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md",
                isOccupied ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50" : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50"
            )}
            onClick={handleCardClick}
        >
            <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/table-card:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); onEdit(table); }}>
                <Edit className="h-3 w-3" />
            </Button>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">{table.name}</CardTitle>
                <TableIcon className={cn("h-6 w-6", isOccupied ? "text-red-500" : "text-green-500")} />
            </CardHeader>
            <CardContent>
                {isOccupied ? (
                    <div className='text-center'>
                        <div className="font-bold text-xl text-red-600 dark:text-red-400">{total.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{itemCount} {UI_TEXT.items[language]}</div>
                         <Button variant="destructive" size="sm" className="w-full mt-2" onClick={(e) => { e.stopPropagation(); onOpenCart()}}>
                            <ShoppingCart className="w-4 h-4 me-2"/> {UI_TEXT.viewOrder[language]}
                        </Button>
                    </div>
                ) : (
                    <div className='text-center'>
                        <div className="font-bold text-xl text-green-600 dark:text-green-400">{UI_TEXT.available[language]}</div>
                        <div className="text-xs text-muted-foreground invisible">_</div>
                        <Button variant="ghost" size="sm" className="w-full mt-2">
                            <PlusCircle className="w-4 h-4 me-2"/> {UI_TEXT.newOrder[language]}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

interface TablesManagementTabProps {
  tables: Table[];
  onTablesChange: (tables: Table[]) => void;
  activeTableId: number | null;
  onSelectTable: (id: number | null) => void;
  isFullScreen?: boolean;
  onOpenCart: () => void;
  language: Language;
}

const TablesManagementTab: React.FC<TablesManagementTabProps> = ({ tables, onTablesChange, activeTableId, onSelectTable, isFullScreen = false, onOpenCart, language }) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingTable, setEditingTable] = React.useState<Table | null>(null);

  const handleAdd = () => {
    setEditingTable(null);
    setDialogOpen(true);
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
    setDialogOpen(true);
  };

  const handleDelete = (tableId: number) => {
    onTablesChange(tables.filter(t => t.id !== tableId));
    if (activeTableId === tableId) {
      onSelectTable(null);
    }
  };

  const handleSave = (name: string) => {
    if (editingTable) {
      onTablesChange(tables.map(t => t.id === editingTable.id ? { ...t, name } : t));
    } else {
      const newTable: Table = {
        id: Date.now(),
        name,
        cart: [],
        selectedCustomerId: null,
      };
      onTablesChange([...tables, newTable]);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <Card className={cn(isFullScreen ? "" : "h-full")}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.manageTables[language]}</CardTitle>
              <CardDescription>{UI_TEXT.viewAndManageTables[language]}</CardDescription>
            </div>
            <Button size="sm" className="w-full sm:w-auto" onClick={handleAdd}>
                <PlusCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
                {UI_TEXT.addTable[language]}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
           <ScrollArea className={cn(isFullScreen ? 'h-[calc(100vh-18rem)]' : 'h-[calc(100vh-22rem)]')}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tables.map(table => (
                        <TableCard 
                            key={table.id}
                            table={table}
                            isActive={table.id === activeTableId}
                            onSelect={onSelectTable}
                            onOpenCart={onOpenCart}
                            onEdit={handleEdit}
                            language={language}
                        />
                    ))}
                </div>
            </ScrollArea>
        </CardContent>
      </Card>
      <TableDialog 
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave} 
        table={editingTable} 
        language={language}
      >
        {/* This is a dummy trigger, the dialog is controlled by `isOpen` state */}
        <span /> 
      </TableDialog>
    </>
  );
};

export default TablesManagementTab;
