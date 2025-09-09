import * as React from 'react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  language: 'en' | 'ar';
}

const UI_TEXT = {
  addToCart: { en: 'Add to Cart', ar: 'أضف للسلة' },
}

const ProductCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void; language: 'en' | 'ar' }> = ({ product, onAddToCart, language }) => {
  return (
    <Card className="flex flex-col justify-between overflow-hidden transition-shadow duration-200 ease-in-out hover:shadow-lg">
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-base">{language === 'ar' ? product.nameAr : product.name}</CardTitle>
        <p className="text-lg font-semibold text-primary">{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <Button className="w-full" onClick={() => onAddToCart(product)} size="sm">
          <PlusCircle className={language === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
          {UI_TEXT.addToCart[language]}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, language }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} language={language} />
      ))}
    </div>
  );
};

export default ProductGrid;
