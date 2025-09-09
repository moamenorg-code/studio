import * as React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';

type Language = 'en' | 'ar';

const UI_TEXT = {
  viewCart: { en: 'View Cart', ar: 'عرض السلة' },
  items: { en: 'items', ar: 'أصناف' },
  total: { en: 'Total', ar: 'الإجمالي' },
};

interface FloatingCartBarProps {
  cart: CartItem[];
  language: Language;
  onOpenCart: () => void;
}

const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ cart, language, onOpenCart }) => {
  const itemCount = React.useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const finalTotal = React.useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);


  if (itemCount === 0 || !isClient) {
    return null;
  }
  
  const { motion: Motion } = require('framer-motion');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto max-w-4xl p-2 sm:p-4">
        <Motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            onClick={onOpenCart}
            style={{ cursor: 'pointer' }}
            className="group flex h-20 items-center justify-between overflow-hidden rounded-xl bg-primary/95 p-4 text-primary-foreground shadow-2xl backdrop-blur-lg transition-transform duration-300 hover:scale-[1.02] active:scale-100"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
                <ShoppingCart className="h-8 w-8 text-primary-foreground/80 transition-transform duration-300 group-hover:scale-110" />
                <Badge variant="destructive" className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary">
                    {itemCount}
                </Badge>
            </div>
            <div>
              <p className="text-lg font-bold">
                  {UI_TEXT.viewCart[language]}
              </p>
               <p className="text-sm opacity-80">
                {itemCount} {UI_TEXT.items[language]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-end">
                <p className="text-sm opacity-80">{UI_TEXT.total[language]}</p>
                <p className="text-2xl font-bold">{finalTotal.toFixed(2)}</p>
            </div>
            <ArrowRight className={`h-6 w-6 text-primary-foreground/80 transition-transform duration-300 group-hover:translate-x-1 ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </div>
        </Motion.div>
      </div>
    </div>
  );
};

export default FloatingCartBar;
