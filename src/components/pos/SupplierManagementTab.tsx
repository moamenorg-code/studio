import * as React from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import type { Supplier } from '@/lib/types';
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

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageSuppliers: { en: 'Manage Suppliers', ar: 'إدارة الموردين' },
  manageYourSuppliers: { en: 'View, add, edit, and remove your suppliers.', ar: 'عرض وإضافة وتعديل وحذف مورديك.' },
  addSupplier: { en: 'Add Supplier', ar: 'إضافة مورد' },
  name: { en: 'Name', ar: 'الاسم' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  address: { en: 'Address', ar: 'العنوان' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  noSuppliers: { en: 'No suppliers found.', ar: 'لم يتم العثور على موردين.' },
};

interface SupplierManagementTabProps {
  suppliers: Supplier[];
  onSuppliersChange: (suppliers: Supplier[]) => void;
  language: Language;
}

const SupplierManagementTab: React.FC<SupplierManagementTabProps> = ({ suppliers, onSuppliersChange, language }) => {

  const handleAddSupplier = () => {
     alert('Add supplier functionality not implemented yet.');
  };

  const handleEditSupplier = (supplier: Supplier) => {
     alert('Edit supplier functionality not implemented yet.');
  };

  const handleDeleteSupplier = (supplierId: number) => {
    onSuppliersChange(suppliers.filter(s => s.id !== supplierId));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{UI_TEXT.manageSuppliers[language]}</CardTitle>
              <CardDescription>{UI_TEXT.manageYourSuppliers[language]}</CardDescription>
            </div>
            <Button onClick={handleAddSupplier}>
              <PlusCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {UI_TEXT.addSupplier[language]}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{UI_TEXT.name[language]}</TableHead>
                <TableHead>{UI_TEXT.phone[language]}</TableHead>
                <TableHead>{UI_TEXT.address[language]}</TableHead>
                <TableHead>
                  <span className="sr-only">{UI_TEXT.actions[language]}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.length > 0 ? (
                suppliers.map(supplier => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell dir="ltr">{supplier.phone}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>{UI_TEXT.edit[language]}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteSupplier(supplier.id)} className="text-destructive">{UI_TEXT.delete[language]}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {UI_TEXT.noSuppliers[language]}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default SupplierManagementTab;
