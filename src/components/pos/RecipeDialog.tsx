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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Recipe, RawMaterial, RecipeItem } from '@/lib/types';
import { PlusCircle, Trash2 } from 'lucide-react';

type Language = 'en' | 'ar';

const UI_TEXT = {
  addRecipe: { en: 'Add Recipe', ar: 'إضافة وصفة' },
  editRecipe: { en: 'Edit Recipe', ar: 'تعديل وصفة' },
  recipeInfo: { en: 'Fill in the recipe details below.', ar: 'املأ تفاصيل الوصفة أدناه.' },
  recipeName: { en: 'Recipe Name', ar: 'اسم الوصفة' },
  recipeItems: { en: 'Recipe Items', ar: 'مكونات الوصفة' },
  addItem: { en: 'Add Item', ar: 'إضافة مكون' },
  item: { en: 'Item', ar: 'المكون' },
  quantity: { en: 'Quantity', ar: 'الكمية' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
};

interface RecipeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (recipe: Omit<Recipe, 'id'> | Recipe) => void;
  recipe: Recipe | null;
  rawMaterials: RawMaterial[];
  language: Language;
}

const RecipeDialog: React.FC<RecipeDialogProps> = ({ isOpen, onOpenChange, onSave, recipe, rawMaterials, language }) => {
  const [name, setName] = React.useState('');
  const [items, setItems] = React.useState<RecipeItem[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      if (recipe) {
        setName(recipe.name);
        setItems(recipe.items);
      } else {
        setName('');
        setItems([]);
      }
    }
  }, [recipe, isOpen]);

  const handleAddItem = () => {
    if (rawMaterials.length > 0) {
        setItems([...items, { rawMaterialId: rawMaterials[0].id, quantity: 1 }]);
    }
  };

  const handleItemChange = (index: number, field: keyof RecipeItem, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = Number(value);
    setItems(newItems);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSave = () => {
    if (name && items.length > 0) {
      const recipeToSave = {
        ...(recipe || {}),
        name,
        items,
      };
      onSave(recipeToSave as Omit<Recipe, 'id'> | Recipe);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{recipe ? UI_TEXT.editRecipe[language] : UI_TEXT.addRecipe[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.recipeInfo[language]}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="recipeName">{UI_TEXT.recipeName[language]}</Label>
            <Input id="recipeName" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <Label>{UI_TEXT.recipeItems[language]}</Label>
            <ScrollArea className="h-60 rounded-md border p-2">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-7">
                       <Select onValueChange={(value) => handleItemChange(index, 'rawMaterialId', value)} value={String(item.rawMaterialId)} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            <SelectTrigger>
                                <SelectValue placeholder={UI_TEXT.item[language]} />
                            </SelectTrigger>
                            <SelectContent>
                                {rawMaterials.map(m => (
                                <SelectItem key={m.id} value={String(m.id)}>{language === 'ar' ? m.nameAr : m.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Input
                      type="number"
                      placeholder={UI_TEXT.quantity[language]}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="col-span-4 text-center"
                      dir="ltr"
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="col-span-1 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button variant="outline" size="sm" onClick={handleAddItem} className="mt-2">
              <PlusCircle className={language === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
              {UI_TEXT.addItem[language]}
            </Button>
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

export default RecipeDialog;
