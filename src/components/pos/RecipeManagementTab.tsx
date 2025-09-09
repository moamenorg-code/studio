import * as React from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import type { Recipe, RawMaterial } from '@/lib/types';
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
import RecipeDialog from './RecipeDialog';
import { Badge } from '../ui/badge';

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageRecipes: { en: 'Manage Recipes', ar: 'إدارة الوصفات' },
  manageYourRecipes: { en: 'Define recipes to automatically track inventory consumption.', ar: 'عرّف الوصفات لتتبع استهلاك المخزون تلقائيًا.' },
  addRecipe: { en: 'Add Recipe', ar: 'إضافة وصفة' },
  name: { en: 'Recipe Name', ar: 'اسم الوصفة' },
  ingredients: { en: 'Ingredients', ar: 'المكونات' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  noRecipes: { en: 'No recipes found.', ar: 'لم يتم العثور على وصفات.' },
};

interface RecipeManagementTabProps {
  recipes: Recipe[];
  onRecipesChange: (recipes: Recipe[]) => void;
  rawMaterials: RawMaterial[];
  language: Language;
}

const RecipeManagementTab: React.FC<RecipeManagementTabProps> = ({ recipes, onRecipesChange, rawMaterials, language }) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingRecipe, setEditingRecipe] = React.useState<Recipe | null>(null);

  const handleAddRecipe = () => {
    setEditingRecipe(null);
    setDialogOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setDialogOpen(true);
  };

  const handleDeleteRecipe = (recipeId: number) => {
    onRecipesChange(recipes.filter(r => r.id !== recipeId));
  };
  
  const handleSaveRecipe = (recipe: Omit<Recipe, 'id'> | Recipe) => {
    if ('id' in recipe && editingRecipe) {
        onRecipesChange(recipes.map(r => (r.id === recipe.id ? recipe : r)));
    } else {
        const newRecipe = { ...recipe, id: Date.now() };
        onRecipesChange([...recipes, newRecipe]);
    }
    setDialogOpen(false);
  };
  
  const getIngredientName = (id: number) => {
      const material = rawMaterials.find(m => m.id === id);
      if (!material) return 'Unknown';
      return language === 'ar' ? material.nameAr : material.name;
  }

  return (
    <>
      <Card className='shadow-none border-none'>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.manageRecipes[language]}</CardTitle>
              <CardDescription>{UI_TEXT.manageYourRecipes[language]}</CardDescription>
            </div>
            <Button onClick={handleAddRecipe} className="w-full sm:w-auto">
              <PlusCircle className="me-2 h-4 w-4" />
              {UI_TEXT.addRecipe[language]}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-28rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{UI_TEXT.name[language]}</TableHead>
                  <TableHead>{UI_TEXT.ingredients[language]}</TableHead>
                  <TableHead>
                    <span className="sr-only">{UI_TEXT.actions[language]}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes.length > 0 ? (
                  recipes.map(recipe => (
                    <TableRow key={recipe.id}>
                      <TableCell className="font-medium">{recipe.name}</TableCell>
                      <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {recipe.items.map((item, index) => (
                                <Badge key={index} variant="secondary">{getIngredientName(item.rawMaterialId)} ({item.quantity})</Badge>
                            ))}
                          </div>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditRecipe(recipe)}>{UI_TEXT.edit[language]}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteRecipe(recipe.id)} className="text-destructive">{UI_TEXT.delete[language]}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      {UI_TEXT.noRecipes[language]}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <RecipeDialog 
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveRecipe}
        recipe={editingRecipe}
        rawMaterials={rawMaterials}
        language={language}
      />
    </>
  );
};

export default RecipeManagementTab;
