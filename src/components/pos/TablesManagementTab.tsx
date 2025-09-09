import * as React from 'react';
import { PlusCircle, Edit, ShoppingCart, Table as TableIcon, ArrowRightLeft } from 'lucide-react';
import type { Table } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '../ui/separator';

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageTables: { en: 'Manage Tables', ar: 'إدارة الطاولات' },
  viewAndManageTables: { en: 'View and manage your tables.', ar: 'عرض وإدارة طاولاتك.' },
  addTable: { en: 'Add Table', ar: 'إضافة طاولة' },
  editTable: { en: 'Edit Table', ar: 'تعديل الطاولة' },
  transferTable: { en: 'Transfer Table', ar: 'نقل الطاولة' },
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
  actions: { en: 'Actions', ar: 'الإجراءات' },
  selectDestination: { en: 'Select Destination Table', ar: 'اختر الطاولة الهدف' },
  selectDestinationDesc: { en: 'Please select an available table to move the order to.', ar: 'يرجى اختيار طاولة متاحة لنقل الطلب إليها.' },
  noAvailableTables: { en: 'No available tables to transfer to.', ar: 'لا توجد طاولات متاحة للنقل.' },
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
    onTransfer: (table: Table) => void;
    onDelete: (id: number) => void;
    language: Language;
}

const TableCard: React.FC<TableCardProps> = ({ table, isActive, onSelect, onOpenCart, onEdit, onTransfer, onDelete, language }) => {
    const isOccupied = table.cart && table.cart.length > 0;
    const total = table.cart ? table.cart.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
    const itemCount = table.cart ? table.cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

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
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="absolute top-2 end-2 h-7 w-7" onClick={(e) => e.stopPropagation()}>
                        <Edit className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => onEdit(table)}>
                        <Edit className="h-4 w-4 me-2" />
                        {UI_TEXT.editTable[language]}
                    </DropdownMenuItem>
                    {isOccupied && (
                        <DropdownMenuItem onClick={() => onTransfer(table)}>
                           <ArrowRightLeft className="h-4 w-4 me-2" />
                            {UI_TEXT.transferTable[language]}
                        </DropdownMenuItem>
                    )}
                    <Separator />
                    <DropdownMenuItem onClick={() => onDelete(table.id)} className="text-destructive">
                        <Edit className="h-4 w-4 me-2" />
                        {UI_TEXT.delete[language]}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

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
                        <Button variant="default" size="sm" className="w-full mt-2">
                            <PlusCircle className="w-4 h-4 me-2"/> {UI_TEXT.newOrder[language]}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

interface TransferTableDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onTransfer: (destinationTableId: number) => void;
  tables: Table[];
  sourceTable: Table | null;
  language: Language;
}

const TransferTableDialog: React.FC<TransferTableDialogProps> = ({ isOpen, onOpenChange, onTransfer, tables, sourceTable, language }) => {
  const availableTables = tables.filter(t => t.id !== sourceTable?.id && (!t.cart || t.cart.length === 0));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{UI_TEXT.transferTable[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.selectDestinationDesc[language]}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 my-4">
            <div className="grid grid-cols-3 gap-4 p-1">
                {availableTables.length > 0 ? (
                    availableTables.map(table => (
                        <Button 
                            key={table.id}
                            variant="outline"
                            className="h-20 text-lg"
                            onClick={() => onTransfer(table.id)}
                        >
                            {table.name}
                        </Button>
                    ))
                ) : (
                    <p className="col-span-3 text-center text-muted-foreground">{UI_TEXT.noAvailableTables[language]}</p>
                )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

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
  const [isAddEditDialogOpen, setAddEditDialogOpen] = React.useState(false);
  const [isTransferDialogOpen, setTransferDialogOpen] = React.useState(false);
  const [editingTable, setEditingTable] = React.useState<Table | null>(null);
  const [transferSourceTable, setTransferSourceTable] = React.useState<Table | null>(null);

  const handleAdd = () => {
    setEditingTable(null);
    setAddEditDialogOpen(true);
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
    setAddEditDialogOpen(true);
  };
  
  const handleOpenTransfer = (table: Table) => {
    setTransferSourceTable(table);
    setTransferDialogOpen(true);
  }

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
    setAddEditDialogOpen(false);
  };
  
  const handleConfirmTransfer = (destinationTableId: number) => {
      if (!transferSourceTable) return;

      const sourceTableData = tables.find(t => t.id === transferSourceTable.id);
      if (!sourceTableData) return;

      const updatedTables = tables.map(table => {
          if (table.id === destinationTableId) {
              return { ...table, cart: sourceTableData.cart, selectedCustomerId: sourceTableData.selectedCustomerId };
          }
          if (table.id === transferSourceTable.id) {
              return { ...table, cart: [], selectedCustomerId: null };
          }
          return table;
      });

      onTablesChange(updatedTables);
      onSelectTable(destinationTableId); // Optionally, make the destination table active
      setTransferDialogOpen(false);
  }

  return (
    <>
      <Card className={cn(isFullScreen ? "" : "h-full")}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.manageTables[language]}</CardTitle>
              <CardDescription>{UI_TEXT.viewAndManageTables[language]}</CardDescription>
            </div>
            <TableDialog 
                isOpen={isAddEditDialogOpen && editingTable === null}
                onOpenChange={setAddEditDialogOpen}
                onSave={handleSave} 
                table={editingTable} 
                language={language}
              >
              <Button size="sm" className="w-full sm:w-auto" onClick={handleAdd}>
                  <PlusCircle className="me-2 h-4 w-4" />
                  {UI_TEXT.addTable[language]}
              </Button>
            </TableDialog>
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
                            onTransfer={handleOpenTransfer}
                            onDelete={handleDelete}
                            language={language}
                        />
                    ))}
                </div>
            </ScrollArea>
        </CardContent>
      </Card>
      <TableDialog 
        isOpen={isAddEditDialogOpen && editingTable !== null}
        onOpenChange={(open) => { if (!open) setEditingTable(null); setAddEditDialogOpen(open); }}
        onSave={handleSave} 
        table={editingTable} 
        language={language}
      >
        {/* This is a dummy trigger, the dialog is controlled by `isOpen` state */}
        <span /> 
      </TableDialog>

      <TransferTableDialog
        isOpen={isTransferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        onTransfer={handleConfirmTransfer}
        tables={tables}
        sourceTable={transferSourceTable}
        language={language}
      />
    </>
  );
};

export default TablesManagementTab;
