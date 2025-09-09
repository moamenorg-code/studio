import * as React from 'react';
import { PlusCircle } from 'lucide-react';
import type { Purchase, Supplier, RawMaterial } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import PurchaseDialog from './PurchaseDialog';

type Language = 'en' | 'ar';

const UI_TEXT = {
  managePurchases: { en: 'Manage Purchases', ar: 'إدارة المشتريات' },
  manageYourPurchases: { en: 'Record and view your purchase invoices.', ar: 'سجل واعرض فواتير مشترياتك.' },
  addPurchase: { en: 'Add Purchase', ar: 'إضافة فاتورة شراء' },
  invoiceId: { en: 'Invoice ID', ar: 'رقم الفاتورة' },
  supplier: { en: 'Supplier', ar: 'المورد' },
  date: { en: 'Date', ar: 'التاريخ' },
  total: { en: 'Total', ar: 'الإجمالي' },
  noPurchases: { en: 'No purchases found.', ar: 'لم يتم العثور على مشتريات.' },
};

interface PurchaseManagementTabProps {
  suppliers: Supplier[];
  rawMaterials: RawMaterial[];
  onRawMaterialsChange: (materials: RawMaterial[]) => void;
  language: Language;
}

const PurchaseManagementTab: React.FC<PurchaseManagementTabProps> = ({ suppliers, rawMaterials, onRawMaterialsChange, language }) => {
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const handleAddPurchase = () => {
    setDialogOpen(true);
  };
  
  const handleSavePurchase = (purchase: Omit<Purchase, 'id' | 'createdAt'>) => {
    const newPurchase: Purchase = {
        ...purchase,
        id: `PUR-${Date.now()}`,
        createdAt: new Date(),
    };
    setPurchases(prev => [...prev, newPurchase]);

    // Update raw material stock
    const updatedMaterials = [...rawMaterials];
    newPurchase.items.forEach(item => {
        const materialIndex = updatedMaterials.findIndex(m => m.id === item.rawMaterialId);
        if (materialIndex !== -1) {
            updatedMaterials[materialIndex].stock += item.quantity;
        }
    });
    onRawMaterialsChange(updatedMaterials);

    setDialogOpen(false);
  };
  
  const getSupplierName = (supplierId: number) => {
      return suppliers.find(s => s.id === supplierId)?.name || 'Unknown';
  }

  return (
    <>
      <Card className='shadow-none border-none'>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.managePurchases[language]}</CardTitle>
              <CardDescription>{UI_TEXT.manageYourPurchases[language]}</CardDescription>
            </div>
            <Button onClick={handleAddPurchase} className="w-full sm:w-auto">
              <PlusCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {UI_TEXT.addPurchase[language]}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-28rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{UI_TEXT.invoiceId[language]}</TableHead>
                  <TableHead>{UI_TEXT.supplier[language]}</TableHead>
                  <TableHead>{UI_TEXT.date[language]}</TableHead>
                  <TableHead className="text-end">{UI_TEXT.total[language]}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.length > 0 ? (
                  purchases.map(purchase => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">{purchase.id}</TableCell>
                      <TableCell>{getSupplierName(purchase.supplierId)}</TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(purchase.createdAt)}
                      </TableCell>
                      <TableCell className="text-end">{purchase.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      {UI_TEXT.noPurchases[language]}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <PurchaseDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSavePurchase}
        suppliers={suppliers}
        rawMaterials={rawMaterials}
        language={language}
      />
    </>
  );
};

export default PurchaseManagementTab;
