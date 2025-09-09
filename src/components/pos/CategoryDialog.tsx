import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from '@/lib/types';

type Language = 'en' | 'ar';

const UI_TEXT = {
  editCategory: { en: 'Edit Category', ar: 'تعديل الفئة' },
  addCategory: { en: 'Add Category', ar: 'إضافة فئة' },
  categoryInfo: { en: 'Provide the category details below.', ar: 'أدخل تفاصيل الفئة أدناه.' },
  nameEn: { en: 'Name (English)', ar: 'الاسم (الإنجليزية)' },
  nameAr: { en: 'Name (Arabic)', ar: 'الاسم (العربية)' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
};

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: Omit<Category, 'id'> | Category) => void;
  category: Category | null;
  language: Language;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({ isOpen, onOpenChange, onSave, category, language }) => {
  const [formData, setFormData] = React.useState<Partial<Category>>({});

  React.useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData(category);
      } else {
        setFormData({
          name: '',
          nameAr: '',
        });
      }
    }
  }, [category, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (formData.name && formData.nameAr) {
      onSave(formData as Category);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? UI_TEXT.editCategory[language] : UI_TEXT.addCategory[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.categoryInfo[language]}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{UI_TEXT.nameEn[language]}</Label>
            <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameAr">{UI_TEXT.nameAr[language]}</Label>
            <Input id="nameAr" name="nameAr" value={formData.nameAr || ''} onChange={handleChange} dir="rtl" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{UI_TEXT.cancel[language]}</Button>
          <Button onClick={handleSave}>{UI_TEXT.save[language]}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
