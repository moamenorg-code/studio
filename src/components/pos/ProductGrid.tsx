import * as React from 'react';
import Image from 'next/image';
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
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <Image
            src={product.image}
            alt={language === 'ar' ? product.nameAr : product.name}
            data-ai-hint={product.dataAiHint}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-lg">{language === 'ar' ? product.nameAr : product.name}</CardTitle>
        <p className="text-lg font-semibold text-primary">{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => onAddToCart(product)}>
          <PlusCircle className={language === 'ar' ? "ms-2 h-4 w-4" : "me-2 h-4 w-4"} />
          {UI_TEXT.addToCart[language]}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, language }) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} language={language} />
      ))}
    </div>
  );
};

export default ProductGrid;
