import * as React from 'react';
import { ClipboardList, BookCopy } from 'lucide-react';
import type { Product, Recipe, RawMaterial } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductManagementTab from './ProductManagementTab';
import RecipeManagementTab from './RecipeManagementTab';

type Language = 'en' | 'ar';

const UI_TEXT = {
  title: { en: 'Products & Recipes', ar: 'المنتجات والوصفات' },
  description: { en: 'Manage your products and their recipes.', ar: 'إدارة منتجاتك ووصفاتها.' },
  products: { en: 'Products', ar: 'المنتجات' },
  recipes: { en: 'Recipes', ar: 'الوصفات' },
};

interface ProductsAndRecipesTabProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  recipes: Recipe[];
  onRecipesChange: (recipes: Recipe[]) => void;
  rawMaterials: RawMaterial[];
  language: Language;
}

const ProductsAndRecipesTab: React.FC<ProductsAndRecipesTabProps> = ({ 
    products,
    onProductsChange,
    recipes,
    onRecipesChange,
    rawMaterials,
    language 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{UI_TEXT.title[language]}</CardTitle>
        <CardDescription>{UI_TEXT.description[language]}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="products" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products"><ClipboardList className="w-4 h-4 me-2"/>{UI_TEXT.products[language]}</TabsTrigger>
            <TabsTrigger value="recipes"><BookCopy className="w-4 h-4 me-2"/>{UI_TEXT.recipes[language]}</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductManagementTab 
              products={products}
              onProductsChange={onProductsChange}
              recipes={recipes}
              language={language}
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductsAndRecipesTab;
