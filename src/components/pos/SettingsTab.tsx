import * as React from 'react';
import type { Settings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';

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
  save: { en: 'Save Settings', ar: 'حفظ الإعدادات' },
  saveSuccess: { en: 'Settings saved successfully!', ar: 'تم حفظ الإعدادات بنجاح!' },
};

interface SettingsTabProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  language: Language;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ settings, onSettingsChange, language }) => {
  const [currentSettings, setCurrentSettings] = React.useState<Settings>(settings);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setCurrentSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{UI_TEXT.settings[language]}</CardTitle>
        <CardDescription>{UI_TEXT.generalSettings[language]}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Store Information */}
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

        {/* Financials */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{UI_TEXT.financials[language]}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">{UI_TEXT.currencySymbol[language]}</Label>
              <Input id="currency" name="currency" value={currentSettings.currency} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">{UI_TEXT.taxRate[language]}</Label>
              <Input id="taxRate" name="taxRate" type="number" value={currentSettings.taxRate} onChange={handleChange} dir="ltr" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Receipt Customization */}
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

        {/* Thermal Printer Settings */}
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

      </CardContent>
    </Card>
  );
};

export default SettingsTab;
