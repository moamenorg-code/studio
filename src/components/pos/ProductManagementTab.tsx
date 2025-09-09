import * as React from 'react';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
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
import ProductDialog from './ProductDialog';

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageProducts: { en: 'Manage Products', ar: 'إدارة المنتجات' },
  manageYourProducts: { en: 'View, add, edit, and remove your products.', ar: 'عرض وإضافة وتعديل وحذف منتجاتك.' },
  addProduct: { en: 'Add Product', ar: 'إضافة منتج' },
  image: { en: 'Image', ar: 'الصورة' },
  name: { en: 'Name', ar: 'الاسم' },
  price: { en: 'Price', ar: 'السعر' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  noProducts: { en: 'No products found.', ar: 'لم يتم العثور على منتجات.' },
};

interface ProductManagementTabProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  language: Language;
}

const ProductManagementTab: React.FC<ProductManagementTabProps> = ({ products, onProductsChange, language }) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

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
  
  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      onProductsChange(products.map(p => (p.id === product.id ? product : p)));
    } else {
      const newProduct = { ...product, id: Date.now() };
      onProductsChange([...products, newProduct]);
    }
    setDialogOpen(false);
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{UI_TEXT.manageProducts[language]}</CardTitle>
              <CardDescription>{UI_TEXT.manageYourProducts[language]}</CardDescription>
            </div>
            <Button onClick={handleAddProduct}>
              <PlusCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {UI_TEXT.addProduct[language]}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">{UI_TEXT.image[language]}</span>
                </TableHead>
                <TableHead>{UI_TEXT.name[language]}</TableHead>
                <TableHead className="text-end">{UI_TEXT.price[language]}</TableHead>
                <TableHead>
                  <span className="sr-only">{UI_TEXT.actions[language]}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                       <Image
                            alt={language === 'ar' ? product.nameAr : product.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.image}
                            width="64"
                            data-ai-hint={product.dataAiHint}
                        />
                    </TableCell>
                    <TableCell className="font-medium">{language === 'ar' ? product.nameAr : product.name}</TableCell>
                    <TableCell className="text-end">{product.price.toFixed(2)}</TableCell>
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
                  <TableCell colSpan={4} className="h-24 text-center">
                    {UI_TEXT.noProducts[language]}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ProductDialog 
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveProduct}
        product={editingProduct}
        language={language}
      />
    </>
  );
};

export default ProductManagementTab;
