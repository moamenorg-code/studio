import * as React from 'react';
import { Building, Truck } from 'lucide-react';
import type { Supplier, RawMaterial } from '@/lib/types';
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
  onRawMaterialsChange: (materials: RawMaterial[]) => void;
  language: Language;
}

const PurchasesAndSuppliersTab: React.FC<PurchasesAndSuppliersTabProps> = ({ 
    suppliers, 
    onSuppliersChange, 
    rawMaterials,
    onRawMaterialsChange,
    language 
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
              onRawMaterialsChange={onRawMaterialsChange}
              language={language}
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
