import * as React from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import type { Category } from '@/lib/types';
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
import CategoryDialog from './CategoryDialog';

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageCategories: { en: 'Manage Categories', ar: 'إدارة الفئات' },
  manageYourCategories: { en: 'View, add, edit, and remove your product categories.', ar: 'عرض وإضافة وتعديل وحذف فئات منتجاتك.' },
  addCategory: { en: 'Add Category', ar: 'إضافة فئة' },
  name: { en: 'Name', ar: 'الاسم' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  noCategories: { en: 'No categories found.', ar: 'لم يتم العثور على فئات.' },
};

interface CategoryManagementTabProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  language: Language;
}

const CategoryManagementTab: React.FC<CategoryManagementTabProps> = ({ categories, onCategoriesChange, language }) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = (categoryId: number) => {
    onCategoriesChange(categories.filter(c => c.id !== categoryId));
  };
  
  const handleSave = (category: Omit<Category, 'id'> | Category) => {
    if ('id' in category && editingCategory) {
      onCategoriesChange(categories.map(c => (c.id === category.id ? category : c)));
    } else {
      const newCategory = { ...category, id: Date.now() };
      onCategoriesChange([...categories, newCategory]);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <Card className='shadow-none border-none flex flex-col h-full'>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.manageCategories[language]}</CardTitle>
              <CardDescription>{UI_TEXT.manageYourCategories[language]}</CardDescription>
            </div>
            <Button onClick={handleAdd} className="w-full sm:w-auto">
              <PlusCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {UI_TEXT.addCategory[language]}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{UI_TEXT.name[language]}</TableHead>
                <TableHead>
                  <span className="sr-only">{UI_TEXT.actions[language]}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map(category => (
                  <TableRow 
                    key={category.id}
                    data-state={selectedRowId === category.id ? 'selected' : 'none'}
                    onClick={() => setSelectedRowId(category.id)}
                  >
                    <TableCell className="font-medium">{language === 'ar' ? category.nameAr : category.name}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(category)}>{UI_TEXT.edit[language]}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-destructive">{UI_TEXT.delete[language]}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    {UI_TEXT.noCategories[language]}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CategoryDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        category={editingCategory}
        language={language}
      />
    </>
  );
};

export default CategoryManagementTab;
