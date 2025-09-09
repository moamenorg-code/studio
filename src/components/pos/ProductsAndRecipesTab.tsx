import * as React from 'react';
import { ClipboardList, BookCopy, LayoutGrid } from 'lucide-react';
import type { Product, Recipe, RawMaterial, Category } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductManagementTab from './ProductManagementTab';
import RecipeManagementTab from './RecipeManagementTab';
import CategoryManagementTab from './CategoryManagementTab';

type Language = 'en' | 'ar';

const UI_TEXT = {
  title: { en: 'Products, Recipes & Categories', ar: 'المنتجات والوصفات والفئات' },
  description: { en: 'Manage your products, their recipes, and categories.', ar: 'إدارة منتجاتك ووصفاتها وفئاتها.' },
  products: { en: 'Products', ar: 'المنتجات' },
  recipes: { en: 'Recipes', ar: 'الوصفات' },
  categories: { en: 'Categories', ar: 'الفئات' },
};

interface ProductsAndRecipesTabProps {
  products: Product[];
  recipes: Recipe[];
  onRecipesChange: (recipes: Recipe[]) => void;
  rawMaterials: RawMaterial[];
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  language: Language;
  onOpenBarcodeScanner: (onDetect: (barcode: string) => void) => void;
}

const ProductsAndRecipesTab: React.FC<ProductsAndRecipesTabProps> = ({ 
    products,
    recipes,
    onRecipesChange,
    rawMaterials,
    categories,
    onCategoriesChange,
    language,
    onOpenBarcodeScanner
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{UI_TEXT.title[language]}</CardTitle>
        <CardDescription>{UI_TEXT.description[language]}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="products" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products"><ClipboardList className="w-4 h-4 me-2"/>{UI_TEXT.products[language]}</TabsTrigger>
            <TabsTrigger value="recipes"><BookCopy className="w-4 h-4 me-2"/>{UI_TEXT.recipes[language]}</TabsTrigger>
            <TabsTrigger value="categories"><LayoutGrid className="w-4 h-4 me-2"/>{UI_TEXT.categories[language]}</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductManagementTab 
              products={products}
              recipes={recipes}
              categories={categories}
              language={language}
              onOpenBarcodeScanner={onOpenBarcodeScanner}
            />
          </TabsContent>
          <TabsContent value="recipes">
            <RecipeManagementTab
              recipes={recipes}
              onRecipesChange={onRecipesChange}
              rawMaterials={rawMaterials}
              language={language}
            />
          </TabsContent>
          <TabsContent value="categories">
            <CategoryManagementTab
                categories={categories}
                onCategoriesChange={onCategoriesChange}
                language={language}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductsAndRecipesTab;
