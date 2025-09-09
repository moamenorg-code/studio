import * as React from 'react';
import type { Settings, User, Role, AppData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import UserManagement from './UserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCog, Store, Cloud, HardDrive, DatabaseZap } from 'lucide-react';
import BackupRestoreTab from './BackupRestoreTab';
import { db } from '@/lib/firebase';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { products as initialProducts, categories as initialCategories, rawMaterials as initialRawMaterials, recipes as initialRecipes, roles as initialRoles, users as initialUsers, customers as initialCustomers, deliveryReps as initialDeliveryReps, suppliers as initialSuppliers, tables as initialTables } from '@/lib/data';


type Language = 'en' | 'ar';

const UI_TEXT = {
  settings: { en: 'Settings', ar: 'الإعدادات' },
  generalSettings: { en: 'Manage your store settings and preferences.', ar: 'إدارة إعدادات وتفضيلات متجرك.' },
  storeInfo: { en: 'Store Information', ar: 'معلومات المتجر' },
  storeName: { en: 'Store Name', ar: 'اسم المتجر' },
  address: { en: 'Address', ar: 'العنوان' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  financials: { en: 'Financials', ar: 'المالية' },
  currencySymbol: { en: 'Currency Symbol', ar: 'رمز العملة' },
  taxRate: { en: 'Tax Rate (%)', ar: 'نسبة الضريبة (%)' },
  deliveryFee: { en: 'Delivery Fee', ar: 'رسوم التوصيل' },
  receipt: { en: 'Receipt Customization', ar: 'تخصيص الفاتورة' },
  receiptHeader: { en: 'Receipt Header', ar: 'رأس الفاتورة' },
  receiptFooter: { en: 'Receipt Footer', ar: 'تذييل الفاتورة' },
  thermalPrinter: { en: 'Thermal Printer', ar: 'الطابعة الحرارية' },
  printerName: { en: 'Printer Name', ar: 'اسم الطابعة' },
  connectionType: { en: 'Connection Type', ar: 'نوع الاتصال' },
  ipAddress: { en: 'IP Address', ar: 'عنوان IP' },
  paperWidth: { en: 'Paper Width', ar: 'عرض الورق' },
  selectConnectionType: { en: 'Select connection type', ar: 'اختر نوع الاتصال' },
  bluetooth: { en: 'Bluetooth', ar: 'بلوتوث' },
  usb: { en: 'USB', ar: 'USB' },
  network: { en: 'Network', ar: 'شبكة' },
  selectPaperWidth: { en: 'Select paper width', ar: 'اختر عرض الورق' },
  tables: { en: 'Tables Management', ar: 'إدارة الطاولات' },
  enableTables: { en: 'Enable Tables', ar: 'تفعيل نظام الطاولات' },
  enableTablesDesc: { en: 'Enable this to manage orders by tables.', ar: 'فعل هذا الخيار لإدارة الطلبات حسب الطاولات.' },
  usersAndRoles: { en: 'Users & Roles', ar: 'المستخدمون والأدوار' },
  save: { en: 'Save Settings', ar: 'حفظ الإعدادات' },
  saveSuccess: { en: 'Settings saved successfully!', ar: 'تم حفظ الإعدادات بنجاح!' },
  general: { en: 'General', ar: 'عام' },
  backupRestore: { en: 'Backup & Restore', ar: 'النسخ الاحتياطي والاستعادة' },
  seedSuccess: { en: 'Database seeded successfully!', ar: 'تمت تهيئة قاعدة البيانات بنجاح!' },
  seedError: { en: 'Error seeding database', ar: 'خطأ في تهيئة قاعدة البيانات' },
};

interface SettingsTabProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  users: User[];
  onUsersChange: (users: User[]) => void;
  roles: Role[];
  onRolesChange: (roles: Role[]) => void;
  language: Language;
  getAppData: () => AppData;
  onRestore: (data: AppData) => void;
}

const GeneralSettingsTab: React.FC<Pick<SettingsTabProps, 'settings' | 'onSettingsChange' | 'language'>> = ({ settings, onSettingsChange, language }) => {
    const [currentSettings, setCurrentSettings] = React.useState<Settings>(settings);
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setCurrentSettings(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSwitchChange = (name: keyof Settings) => (checked: boolean) => {
        setCurrentSettings(prev => ({
        ...prev,
        [name]: checked,
        }));
    };

    const handleSelectChange = (name: keyof Settings) => (value: string) => {
        setCurrentSettings(prev => ({
        ...prev,
        [name]: value,
        }));
    };
    
    const handleSave = () => {
        onSettingsChange(currentSettings);
        toast({
            title: UI_TEXT.saveSuccess[language],
        });
    };

    React.useEffect(() => {
        setCurrentSettings(settings);
    }, [settings]);

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">{UI_TEXT.storeInfo[language]}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="storeName">{UI_TEXT.storeName[language]}</Label>
                        <Input id="storeName" name="storeName" value={currentSettings.storeName} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">{UI_TEXT.phone[language]}</Label>
                        <Input id="phone" name="phone" value={currentSettings.phone} onChange={handleChange} dir="ltr" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">{UI_TEXT.address[language]}</Label>
                    <Input id="address" name="address" value={currentSettings.address} onChange={handleChange} />
                </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
                <h3 className="text-lg font-medium">{UI_TEXT.tables[language]}</h3>
                <div className="flex items-center space-x-4 rtl:space-x-reverse rounded-md border p-4">
                    <Switch
                    id="enable-tables"
                    checked={currentSettings.enableTables}
                    onCheckedChange={handleSwitchChange('enableTables')}
                    />
                    <div className="flex-1 space-y-1">
                    <Label htmlFor="enable-tables">{UI_TEXT.enableTables[language]}</Label>
                    <p className="text-xs text-muted-foreground">{UI_TEXT.enableTablesDesc[language]}</p>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">{UI_TEXT.financials[language]}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="currency">{UI_TEXT.currencySymbol[language]}</Label>
                        <Input id="currency" name="currency" value={currentSettings.currency} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="taxRate">{UI_TEXT.taxRate[language]}</Label>
                        <Input id="taxRate" name="taxRate" type="number" value={currentSettings.taxRate} onChange={handleChange} dir="ltr" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deliveryFee">{UI_TEXT.deliveryFee[language]}</Label>
                        <Input id="deliveryFee" name="deliveryFee" type="number" value={currentSettings.deliveryFee} onChange={handleChange} dir="ltr" />
                    </div>
                </div>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">{UI_TEXT.receipt[language]}</h3>
                <div className="space-y-2">
                    <Label htmlFor="receiptHeader">{UI_TEXT.receiptHeader[language]}</Label>
                    <Textarea id="receiptHeader" name="receiptHeader" value={currentSettings.receiptHeader} onChange={handleChange} rows={3} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="receiptFooter">{UI_TEXT.receiptFooter[language]}</Label>
                    <Textarea id="receiptFooter" name="receiptFooter" value={currentSettings.receiptFooter} onChange={handleChange} rows={3} />
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">{UI_TEXT.thermalPrinter[language]}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="printerName">{UI_TEXT.printerName[language]}</Label>
                        <Input id="printerName" name="printerName" value={currentSettings.printerName || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="printerConnectionType">{UI_TEXT.connectionType[language]}</Label>
                        <Select name="printerConnectionType" onValueChange={handleSelectChange('printerConnectionType')} value={currentSettings.printerConnectionType} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            <SelectTrigger>
                                <SelectValue placeholder={UI_TEXT.selectConnectionType[language]} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="network">{UI_TEXT.network[language]}</SelectItem>
                                <SelectItem value="bluetooth">{UI_TEXT.bluetooth[language]}</SelectItem>
                                <SelectItem value="usb">{UI_TEXT.usb[language]}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="printerIpAddress">{UI_TEXT.ipAddress[language]}</Label>
                        <Input id="printerIpAddress" name="printerIpAddress" value={currentSettings.printerIpAddress || ''} onChange={handleChange} dir="ltr" disabled={currentSettings.printerConnectionType !== 'network'} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="printerPaperWidth">{UI_TEXT.paperWidth[language]}</Label>
                        <Select name="printerPaperWidth" onValueChange={handleSelectChange('printerPaperWidth')} value={currentSettings.printerPaperWidth} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            <SelectTrigger>
                                <SelectValue placeholder={UI_TEXT.selectPaperWidth[language]} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="80mm">80mm</SelectItem>
                                <SelectItem value="58mm">58mm</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Button onClick={handleSave} size="lg" className="w-full md:w-auto">{UI_TEXT.save[language]}</Button>
        </div>
    );
};


const SettingsTab: React.FC<SettingsTabProps> = (props) => {
  const { language, users, onUsersChange, roles, onRolesChange } = props;
  const { toast } = useToast();

  const handleSeedData = async () => {
    try {
        const batch = writeBatch(db);

        initialProducts.forEach(product => {
            const docRef = doc(db, "products", String(product.id));
            batch.set(docRef, product);
        });
        
        initialCategories.forEach(category => {
            const docRef = doc(collection(db, "categories"), String(category.id));
            batch.set(docRef, category);
        });

        initialRawMaterials.forEach(material => {
            const docRef = doc(collection(db, "raw_materials"), String(material.id));
            batch.set(docRef, material);
        });

        initialRecipes.forEach(recipe => {
            const docRef = doc(collection(db, "recipes"), String(recipe.id));
            batch.set(docRef, recipe);
        });

        initialRoles.forEach(role => {
            const docRef = doc(collection(db, "roles"), String(role.id));
            batch.set(docRef, role);
        });

        initialUsers.forEach(user => {
            const docRef = doc(collection(db, "users"), String(user.id));
            batch.set(docRef, user);
        });

        initialCustomers.forEach(customer => {
            const docRef = doc(collection(db, "customers"), String(customer.id));
            batch.set(docRef, customer);
        });

        initialDeliveryReps.forEach(rep => {
            const docRef = doc(collection(db, "delivery_reps"), String(rep.id));
            batch.set(docRef, rep);
        });
        
        initialSuppliers.forEach(supplier => {
            const docRef = doc(collection(db, "suppliers"), String(supplier.id));
            batch.set(docRef, supplier);
        });
        
        initialTables.forEach(table => {
            const docRef = doc(collection(db, "tables"), String(table.id));
            batch.set(docRef, table);
        });

        await batch.commit();

        toast({
            title: UI_TEXT.seedSuccess[language],
        });

    } catch (error) {
        console.error("Error seeding data:", error);
        toast({
            variant: "destructive",
            title: UI_TEXT.seedError[language],
            description: String(error),
        });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{UI_TEXT.settings[language]}</CardTitle>
        <CardDescription>{UI_TEXT.generalSettings[language]}</CardDescription>
      </CardHeader>
      <CardContent>
         <Tabs defaultValue="general" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general"><Store className="w-4 h-4 me-2"/>{UI_TEXT.general[language]}</TabsTrigger>
                <TabsTrigger value="users"><UserCog className="w-4 h-4 me-2"/>{UI_TEXT.usersAndRoles[language]}</TabsTrigger>
                <TabsTrigger value="backup"><HardDrive className="w-4 h-4 me-2"/>{UI_TEXT.backupRestore[language]}</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="pt-4">
                <GeneralSettingsTab {...props} />
            </TabsContent>
            <TabsContent value="users" className="pt-4">
                <UserManagement 
                    users={users}
                    onUsersChange={onUsersChange}
                    roles={roles}
                    onRolesChange={onRolesChange}
                    language={language}
                />
            </TabsContent>
            <TabsContent value="backup" className="pt-4">
                <BackupRestoreTab
                    language={language}
                    getAppData={props.getAppData}
                    onRestore={props.onRestore}
                    onSeedData={handleSeedData}
                />
            </TabsContent>
         </Tabs>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
