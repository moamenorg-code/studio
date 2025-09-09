import * as React from 'react';
import { ShoppingBag, Package, Bike, Table as TableIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductGrid from './ProductGrid';
import { UI_TEXT } from '@/lib/constants';
import type { Language, ActiveOrder, Product, ActiveView } from '@/lib/types';

interface SalesViewProps {
  language: Language;
  activeOrder: ActiveOrder | null;
  filteredProducts: Product[];
  onAddToCart: (product: Product) => void;
  onNewTakeawayOrder: () => void;
  onNewDeliveryOrder: () => void;
  onSetActiveView: (view: ActiveView) => void;
}

const SalesView: React.FC<SalesViewProps> = ({
  language,
  activeOrder,
  filteredProducts,
  onAddToCart,
  onNewTakeawayOrder,
  onNewDeliveryOrder,
  onSetActiveView,
}) => {
  if (!activeOrder) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert className="max-w-lg text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <AlertTitle className="text-xl mb-2">{UI_TEXT.selectOrderTypePrompt[language]}</AlertTitle>
          <AlertDescription className="mb-6">{UI_TEXT.selectOrderTypePromptDesc[language]}</AlertDescription>
          <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onSetActiveView('tables')} size="lg" className="px-8 py-6 text-lg">
              <TableIcon className="w-6 h-6 me-3" />
              {UI_TEXT.dineIn[language]}
            </Button>
            <Button variant="secondary" onClick={onNewTakeawayOrder} size="lg" className="px-8 py-6 text-lg">
              <Package className="w-6 h-6 me-3" />
              {UI_TEXT.takeaway[language]}
            </Button>
            <Button variant="secondary" onClick={onNewDeliveryOrder} size="lg" className="px-8 py-6 text-lg">
              <Bike className="w-6 h-6 me-3" />
              {UI_TEXT.delivery[language]}
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-1">
        <ProductGrid
          products={filteredProducts}
          onAddToCart={onAddToCart}
          language={language}
        />
      </div>
    </ScrollArea>
  );
};

export default SalesView;
