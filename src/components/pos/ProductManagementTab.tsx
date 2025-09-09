import * as React from 'react';
import { MoreHorizontal, PlusCircle, BookCopy, Search } from 'lucide-react';
import type { Product, Recipe, Category } from '@/lib/types';
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
import ProductDialog from './ProductDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '../ui/input';

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageProducts: { en: 'Manage Products', ar: 'إدارة المنتجات' },
  manageYourProducts: { en: 'View, add, edit, and remove your products.', ar: 'عرض وإضافة وتعديل وحذف منتجاتك.' },
  addProduct: { en: 'Add Product', ar: 'إضافة منتج' },
  name: { en: 'Name', ar: 'الاسم' },
  price: { en: 'Price', ar: 'السعر' },
  category: { en: 'Category', ar: 'الفئة' },
  recipe: { en: 'Recipe', ar: 'الوصفة' },
  noRecipe: { en: 'No Recipe', ar: 'لا توجد وصفة' },
  noCategory: { en: 'No Category', ar: 'لا توجد فئة' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  noProducts: { en: 'No products found.', ar: 'لم يتم العثور على منتجات.' },
  selectRecipe: { en: 'Select a recipe', ar: 'اختر وصفة' },
  selectCategory: { en: 'Select a category', ar: 'اختر فئة' },
  searchPlaceholder: { en: 'Search by name or barcode...', ar: 'ابحث بالاسم أو الباركود...' },
};

interface ProductManagementTabProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  recipes: Recipe[];
  categories: Category[];
  language: Language;
}

const ProductManagementTab: React.FC<ProductManagementTabProps> = ({ products, onProductsChange, recipes, categories, language }) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleAddProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    onProductsChange(products.filter(p => p.id !== productId));
  };
  
  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    let updatedProduct: Product;
    if ('id' in productData && editingProduct) {
      updatedProduct = productData;
      onProductsChange(products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
    } else {
      updatedProduct = { ...productData, id: Date.now() };
      onProductsChange([...products, updatedProduct]);
    }
    setDialogOpen(false);
  };
  
  const handleRecipeChange = (productId: number, recipeId: string) => {
      const newRecipeId = recipeId === 'none' ? undefined : Number(recipeId);
      onProductsChange(products.map(p => p.id === productId ? {...p, recipeId: newRecipeId} : p));
  }

  const handleCategoryChange = (productId: number, categoryId: string) => {
      const newCategoryId = categoryId === 'none' ? undefined : Number(categoryId);
      onProductsChange(products.map(p => p.id === productId ? {...p, categoryId: newCategoryId} : p));
  }
  
  const filteredProducts = React.useMemo(() => {
    if (!searchQuery) return products;
    const lowercasedQuery = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.nameAr.toLowerCase().includes(lowercasedQuery) ||
      (product.barcode && product.barcode.includes(lowercasedQuery))
    );
  }, [products, searchQuery]);


  return (
    <>
      <Card className='shadow-none border-none'>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.manageProducts[language]}</CardTitle>
              <CardDescription>{UI_TEXT.manageYourProducts[language]}</CardDescription>
            </div>
            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
                 <div className="relative">
                    <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                    <Input
                        placeholder={UI_TEXT.searchPlaceholder[language]}
                        className={`${language === 'ar' ? 'pr-10' : 'pl-10'}`}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={handleAddProduct} className="w-full sm:w-auto">
                <PlusCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
                {UI_TEXT.addProduct[language]}
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-31rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{UI_TEXT.name[language]}</TableHead>
                  <TableHead>{UI_TEXT.price[language]}</TableHead>
                  <TableHead>{UI_TEXT.category[language]}</TableHead>
                  <TableHead>{UI_TEXT.recipe[language]}</TableHead>
                  <TableHead>
                    <span className="sr-only">{UI_TEXT.actions[language]}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{language === 'ar' ? product.nameAr : product.name}</TableCell>
                      <TableCell>{product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select 
                            onValueChange={(value) => handleCategoryChange(product.id, value)} 
                            value={product.categoryId ? String(product.categoryId) : 'none'}
                            dir={language === 'ar' ? 'rtl' : 'ltr'}
                        >
                            <SelectTrigger className="h-9 w-[150px]">
                                <SelectValue placeholder={UI_TEXT.selectCategory[language]} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{UI_TEXT.noCategory[language]}</SelectItem>
                                {categories.map(c => (
                                    <SelectItem key={c.id} value={String(c.id)}>{language === 'ar' ? c.nameAr : c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select 
                            onValueChange={(value) => handleRecipeChange(product.id, value)} 
                            value={product.recipeId ? String(product.recipeId) : 'none'}
                            dir={language === 'ar' ? 'rtl' : 'ltr'}
                        >
                            <SelectTrigger className="h-9 w-[150px]">
                                <SelectValue placeholder={UI_TEXT.selectRecipe[language]} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{UI_TEXT.noRecipe[language]}</SelectItem>
                                {recipes.map(r => (
                                    <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>{UI_TEXT.edit[language]}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive">{UI_TEXT.delete[language]}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {UI_TEXT.noProducts[language]}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <ProductDialog 
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        language={language}
      />
    </>
  );
};

export default ProductManagementTab;
