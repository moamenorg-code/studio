import * as React from 'react';
import { ShoppingCart } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';

type Language = 'en' | 'ar';

const UI_TEXT = {
  viewCart: { en: 'View Cart', ar: 'عرض السلة' },
  items: { en: 'items', ar: 'أصناف' },
  total: { en: 'Total:', ar: 'الإجمالي:' },
};

interface FloatingCartBarProps {
  cart: CartItem[];
  language: Language;
  onOpenCart: () => void;
}

const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ cart, language, onOpenCart }) => {
  const itemCount = React.useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const finalTotal = React.useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto max-w-4xl p-2 sm:p-4">
        <div 
            className="flex h-20 items-center justify-between rounded-lg bg-primary/90 p-4 text-primary-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-primary"
            onClick={onOpenCart}
            style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
                <ShoppingCart className="h-8 w-8" />
                <Badge variant="destructive" className="absolute -right-2 -top-2 scale-75">
                    {itemCount}
                </Badge>
            </div>
            <div>
              <p className="hidden text-lg font-bold sm:block">
                  {UI_TEXT.viewCart[language]}
              </p>
              <p className="text-sm opacity-80 sm:hidden">
                {itemCount} {UI_TEXT.items[language]}
              </p>
            </div>
          </div>
          <div className="text-end">
            <p className="text-sm opacity-80">{UI_TEXT.total[language]}</p>
            <p className="text-2xl font-bold">{finalTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCartBar;
