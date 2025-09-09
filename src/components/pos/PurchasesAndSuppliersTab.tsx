import * as React from 'react';
import { Building, Truck } from 'lucide-react';
import type { Supplier, RawMaterial, Purchase, Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PurchaseManagementTab from './PurchaseManagementTab';
import SupplierManagementTab from './SupplierManagementTab';

type Language = 'en' | 'ar';

const UI_TEXT = {
  title: { en: 'Purchases & Suppliers', ar: 'المشتريات والموردين' },
  description: { en: 'Manage your purchase invoices and suppliers.', ar: 'إدارة فواتير الشراء والموردين.' },
  purchases: { en: 'Purchases', ar: 'المشتريات' },
  suppliers: { en: 'Suppliers', ar: 'الموردين' },
};

interface PurchasesAndSuppliersTabProps {
  suppliers: Supplier[];
  onSuppliersChange: (suppliers: Supplier[]) => void;
  rawMaterials: RawMaterial[];
  products: Product[];
  onRawMaterialsChange: (materials: RawMaterial[]) => void;
  purchases: Purchase[];
  onPurchasesChange: (purchases: Purchase[]) => void;
  language: Language;
  onOpenBarcodeScanner: (onDetect: (barcode: string) => void) => void;
}

const PurchasesAndSuppliersTab: React.FC<PurchasesAndSuppliersTabProps> = ({ 
    suppliers, 
    onSuppliersChange, 
    rawMaterials,
    onRawMaterialsChange,
    purchases,
    onPurchasesChange,
    language,
    onOpenBarcodeScanner,
    products
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{UI_TEXT.title[language]}</CardTitle>
        <CardDescription>{UI_TEXT.description[language]}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="purchases" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchases"><Truck className="w-4 h-4 me-2"/>{UI_TEXT.purchases[language]}</TabsTrigger>
            <TabsTrigger value="suppliers"><Building className="w-4 h-4 me-2"/>{UI_TEXT.suppliers[language]}</TabsTrigger>
          </TabsList>
          <TabsContent value="purchases">
            <PurchaseManagementTab 
              suppliers={suppliers}
              rawMaterials={rawMaterials}
              products={products}
              onRawMaterialsChange={onRawMaterialsChange}
              language={language}
              purchases={purchases}
              onPurchasesChange={onPurchasesChange}
              onOpenBarcodeScanner={onOpenBarcodeScanner}
            />
          </TabsContent>
          <TabsContent value="suppliers">
            <SupplierManagementTab
              suppliers={suppliers}
              onSuppliersChange={onSuppliersChange}
              language={language}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PurchasesAndSuppliersTab;
