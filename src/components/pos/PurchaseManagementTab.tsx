import * as React from 'react';
import { PlusCircle, Search } from 'lucide-react';
import type { Purchase, Supplier, RawMaterial, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PurchaseDialog from './PurchaseDialog';
import { Input } from '../ui/input';

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
  searchPlaceholder: { en: 'Search by Invoice ID or supplier...', ar: 'ابحث برقم الفاتورة أو المورد...' },
};

interface PurchaseManagementTabProps {
  suppliers: Supplier[];
  rawMaterials: RawMaterial[];
  products: Product[];
  onRawMaterialsChange: (materials: RawMaterial[]) => void;
  language: Language;
  purchases: Purchase[];
  onPurchasesChange: (purchases: Purchase[]) => void;
  onOpenBarcodeScanner: (onDetect: (barcode: string) => void) => void;
}

const PurchaseManagementTab: React.FC<PurchaseManagementTabProps> = ({ suppliers, rawMaterials, onRawMaterialsChange, language, purchases, onPurchasesChange, onOpenBarcodeScanner, products }) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);

  const handleAddPurchase = () => {
    setDialogOpen(true);
  };
  
  const handleSavePurchase = (purchase: Omit<Purchase, 'id' | 'createdAt'>) => {
    const newPurchase: Purchase = {
        ...purchase,
        id: `PUR-${Date.now()}`,
        createdAt: new Date(),
    };
    onPurchasesChange([...purchases, newPurchase]);

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

  const filteredPurchases = React.useMemo(() => {
    if (!searchQuery) return purchases;
    const lowercasedQuery = searchQuery.toLowerCase();
    return purchases.filter(purchase => {
      const supplierName = getSupplierName(purchase.supplierId).toLowerCase();
      return purchase.id.toLowerCase().includes(lowercasedQuery) ||
             supplierName.includes(lowercasedQuery);
    });
  }, [purchases, searchQuery]);


  return (
    <>
      <Card className='shadow-none border-none flex flex-col h-full'>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.managePurchases[language]}</CardTitle>
              <CardDescription>{UI_TEXT.manageYourPurchases[language]}</CardDescription>
            </div>
             <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
                <div className="relative">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={UI_TEXT.searchPlaceholder[language]}
                        className="ps-10"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={handleAddPurchase} className="w-full sm:w-auto">
                <PlusCircle className="me-2 h-4 w-4" />
                {UI_TEXT.addPurchase[language]}
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
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
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map(purchase => (
                  <TableRow 
                    key={purchase.id}
                    data-state={selectedRowId === purchase.id ? 'selected' : 'none'}
                    onClick={() => setSelectedRowId(purchase.id)}
                  >
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
        </CardContent>
      </Card>
      <PurchaseDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSavePurchase}
        suppliers={suppliers}
        rawMaterials={rawMaterials}
        products={products}
        language={language}
        onOpenBarcodeScanner={onOpenBarcodeScanner}
      />
    </>
  );
};

export default PurchaseManagementTab;
