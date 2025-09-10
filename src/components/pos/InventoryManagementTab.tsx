import * as React from 'react';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import RawMaterialDialog from './RawMaterialDialog';
import { Input } from '../ui/input';

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageInventory: { en: 'Manage Inventory', ar: 'إدارة المخزون' },
  manageRawMaterials: { en: 'View, add, edit, and remove your raw materials.', ar: 'عرض وإضافة وتعديل وحذف الخامات الأولية.' },
  addRawMaterial: { en: 'Add Raw Material', ar: 'إضافة مادة خام' },
  name: { en: 'Name', ar: 'الاسم' },
  stock: { en: 'Stock', ar: 'الكمية المتاحة' },
  unit: { en: 'Unit', ar: 'الوحدة' },
  barcode: { en: 'Barcode', ar: 'الباركود' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  noRawMaterials: { en: 'No raw materials found.', ar: 'لم يتم العثور على مواد خام.' },
  searchPlaceholder: { en: 'Search by name or barcode...', ar: 'ابحث بالاسم أو الباركود...' },
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

  const filteredRawMaterials = React.useMemo(() => {
    if (!searchQuery) return rawMaterials;
    const lowercasedQuery = searchQuery.toLowerCase();
    return rawMaterials.filter(material => 
      material.name.toLowerCase().includes(lowercasedQuery) ||
      material.nameAr.toLowerCase().includes(lowercasedQuery) ||
      (material.barcode && material.barcode.includes(lowercasedQuery))
    );
  }, [rawMaterials, searchQuery]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.manageInventory[language]}</CardTitle>
              <CardDescription>{UI_TEXT.manageRawMaterials[language]}</CardDescription>
            </div>
            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
                <div className="relative">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={UI_TEXT.searchPlaceholder[language]}
                        className="ps-10"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={handleAdd} className="w-full sm:w-auto">
                    <PlusCircle className="me-2 h-4 w-4" />
                    {UI_TEXT.addRawMaterial[language]}
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{UI_TEXT.name[language]}</TableHead>
                  <TableHead>{UI_TEXT.stock[language]}</TableHead>
                  <TableHead>{UI_TEXT.unit[language]}</TableHead>
                  <TableHead>{UI_TEXT.barcode[language]}</TableHead>
                  <TableHead>
                    <span className="sr-only">{UI_TEXT.actions[language]}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRawMaterials.length > 0 ? (
                  filteredRawMaterials.map(material => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{language === 'ar' ? material.nameAr : material.name}</TableCell>
                      <TableCell>{material.stock}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell dir="ltr">{material.barcode || '-'}</TableCell>
                      <TableCell>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {UI_TEXT.noRawMaterials[language]}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
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
