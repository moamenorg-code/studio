import * as React from 'react';
import { ShoppingCart } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';

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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 p-4 backdrop-blur-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex items-center gap-4">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <div>
            <p className="font-bold">
                {itemCount} {UI_TEXT.items[language]}
            </p>
            <p className="text-sm text-muted-foreground">
              {UI_TEXT.total[language]} <span className="font-semibold text-primary">{finalTotal.toFixed(2)}</span>
            </p>
          </div>
        </div>
        <Button onClick={onOpenCart} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <span className="hidden sm:inline">{UI_TEXT.viewCart[language]}</span>
          <span className="sm:hidden">{UI_TEXT.total[language]} {finalTotal.toFixed(2)}</span>
        </Button>
      </div>
    </div>
  );
};

export default FloatingCartBar;
