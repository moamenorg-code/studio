import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HeldOrder } from '@/lib/types';
import { PauseCircle, History } from 'lucide-react';
import { Badge } from '../ui/badge';

type Language = 'en' | 'ar';

const UI_TEXT = {
  heldOrders: { en: 'Held Orders', ar: 'الطلبات المعلقة' },
  manageHeldOrders: { en: 'Restore a previously held order.', ar: 'استرجع طلبًا معلقًا سابقًا.' },
  noHeldOrders: { en: 'No held orders.', ar: 'لا توجد طلبات معلقة.' },
  restore: { en: 'Restore', ar: 'استرجاع' },
  heldAt: { en: 'Held at', ar: 'عُلق في' },
};

interface HeldOrdersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  heldOrders: HeldOrder[];
  onRestoreOrder: (order: HeldOrder) => void;
  language: Language;
}

const HeldOrdersDialog: React.FC<HeldOrdersDialogProps> = ({ isOpen, onOpenChange, heldOrders, onRestoreOrder, language }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PauseCircle /> {UI_TEXT.heldOrders[language]}
          </DialogTitle>
          <DialogDescription>{UI_TEXT.manageHeldOrders[language]}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <ScrollArea className="h-96">
            <div className="space-y-3 p-1">
              {heldOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">{UI_TEXT.noHeldOrders[language]}</p>
              ) : (
                heldOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex-1">
                      <p className="font-semibold">{order.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(order.heldAt))}
                      </p>
                      <Badge variant="secondary" className="mt-1">{order.orderType}</Badge>
                    </div>
                    <Button size="sm" onClick={() => onRestoreOrder(order)}>
                      <History className="me-2 h-4 w-4" />
                      {UI_TEXT.restore[language]}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeldOrdersDialog;

    