import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { HardDrive, Save, Upload, Cloud, AlertTriangle, DatabaseZap } from 'lucide-react';
import type { Language, AppData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type BackupRestoreTabProps = {
  language: Language;
  getAppData: () => AppData;
  onRestore: (data: AppData) => void;
  onSeedData: () => void;
};

const UI_TEXT = {
  title: { en: 'Backup & Restore', ar: 'النسخ الاحتياطي والاستعادة' },
  description: { en: 'Save your data to a file or restore it from a backup.', ar: 'احفظ بياناتك في ملف أو استعدها من نسخة احتياطية.' },
  localBackup: { en: 'Local Backup', ar: 'نسخ احتياطي محلي' },
  localBackupDesc: { en: 'Download all your data to a single JSON file on your device.', ar: 'قم بتنزيل جميع بياناتك إلى ملف JSON واحد على جهازك.' },
  backupToDevice: { en: 'Backup to Device', ar: 'نسخ احتياطي للجهاز' },
  restoreFromDevice: { en: 'Restore from Device', ar: 'استعادة من الجهاز' },
  cloudBackup: { en: 'Cloud Backup (Coming Soon)', ar: 'نسخ احتياطي سحابي (قريباً)' },
  cloudBackupDesc: { en: 'Connect your Google Drive account to backup and restore data automatically.', ar: 'اربط حساب Google Drive الخاص بك لعمل نسخ احتياطي واستعادة للبيانات تلقائيًا.' },
  connectGoogleDrive: { en: 'Connect Google Drive', ar: 'ربط Google Drive' },
  restoreConfirmTitle: { en: 'Are you absolutely sure?', ar: 'هل أنت متأكد تمامًا؟' },
  restoreConfirmDesc: { en: 'This will overwrite all current data. This action cannot be undone. Restored data will be applied after the application reloads.', ar: 'سيؤدي هذا إلى الكتابة فوق جميع البيانات الحالية. لا يمكن التراجع عن هذا الإجراء. سيتم تطبيق البيانات المستعادة بعد إعادة تحميل التطبيق.'},
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  continue: { en: 'Continue', ar: 'متابعة' },
  backupSuccess: { en: 'Backup Successful', ar: 'تم النسخ الاحتياطي بنجاح' },
  backupSuccessDesc: { en: (filename: string) => `Data saved to ${filename}`, ar: (filename: string) => `تم حفظ البيانات في ${filename}`},
  restoreError: { en: 'Restore Failed', ar: 'فشل الاستعادة' },
  restoreErrorDesc: { en: 'Invalid backup file format.', ar: 'تنسيق ملف النسخ الاحتياطي غير صالح.'},
  seedData: { en: 'Seed Data', ar: 'تهيئة البيانات الأولية' },
  seedDataDesc: { en: 'Populate the database with initial sample data. Use only on a fresh installation.', ar: 'املأ قاعدة البيانات بالبيانات النموذجية الأولية. استخدم هذا الخيار فقط عند التثبيت الجديد.' },
  seedButton: { en: 'Seed Sample Data', ar: 'تهيئة البيانات' },
  seedConfirmTitle: { en: 'Seed Database?', ar: 'تهيئة قاعدة البيانات؟' },
  seedConfirmDesc: { en: 'This will add sample data to your collections. It is recommended to do this only once on an empty database. This may overwrite existing data if IDs match.', ar: 'سيؤدي هذا إلى إضافة بيانات نموذجية إلى مجموعاتك. يوصى بالقيام بذلك مرة واحدة فقط على قاعدة بيانات فارغة. قد يؤدي هذا إلى الكتابة فوق البيانات الموجودة إذا تطابقت المعرفات.'},
};

const BackupRestoreTab: React.FC<BackupRestoreTabProps> = ({ language, getAppData, onRestore, onSeedData }) => {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    const data = getAppData();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    const filename = `rms-pos-backup-${date}.json`;
    link.href = jsonString;
    link.download = filename;
    link.click();
    toast({
        title: UI_TEXT.backupSuccess[language],
        description: UI_TEXT.backupSuccessDesc[language](filename),
    });
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const data = JSON.parse(text);
            // Simple validation to check if it's our backup file
            if (data.products && data.settings && data.users) {
              onRestore(data);
            } else {
              throw new Error('Invalid file content');
            }
          }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: UI_TEXT.restoreError[language],
                description: UI_TEXT.restoreErrorDesc[language],
            });
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>{UI_TEXT.title[language]}</CardTitle>
        <CardDescription>{UI_TEXT.description[language]}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* Seed Data */}
         <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <DatabaseZap className="w-8 h-8 text-primary" />
              <div>
                <CardTitle>{UI_TEXT.seedData[language]}</CardTitle>
                <CardDescription>{UI_TEXT.seedDataDesc[language]}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <DatabaseZap className="me-2 h-4 w-4" />
                  {UI_TEXT.seedButton[language]}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle />{UI_TEXT.seedConfirmTitle[language]}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {UI_TEXT.seedConfirmDesc[language]}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{UI_TEXT.cancel[language]}</AlertDialogCancel>
                  <AlertDialogAction onClick={onSeedData} className="bg-destructive hover:bg-destructive/90">{UI_TEXT.continue[language]}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Local Backup */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <HardDrive className="w-8 h-8 text-primary" />
              <div>
                <CardTitle>{UI_TEXT.localBackup[language]}</CardTitle>
                <CardDescription>{UI_TEXT.localBackupDesc[language]}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleBackup} className="w-full sm:w-auto">
              <Save className="me-2 h-4 w-4" />
              {UI_TEXT.backupToDevice[language]}
            </Button>

             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Upload className="me-2 h-4 w-4" />
                        {UI_TEXT.restoreFromDevice[language]}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle/>{UI_TEXT.restoreConfirmTitle[language]}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {UI_TEXT.restoreConfirmDesc[language]}
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>{UI_TEXT.cancel[language]}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRestoreClick}>{UI_TEXT.continue[language]}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Cloud Backup */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Cloud className="w-8 h-8 text-muted-foreground" />
              <div>
                <CardTitle className="text-muted-foreground">{UI_TEXT.cloudBackup[language]}</CardTitle>
                <CardDescription>{UI_TEXT.cloudBackupDesc[language]}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button disabled>
              <svg className="me-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.152 10.344C19.035 9.773 18.79 9.243 18.435 8.784L12.565 0L6.57 8.784C5.865 9.78 5.865 11.22 6.57 12.216L9.666 16.92L12.565 21.744L15.345 16.92L19.425 10.344H19.152Z" />
                <path d="M6.57 12.216L0 12.216L6.57 0V12.216Z" />
                <path d="M15.345 16.992L12.565 21.744L9.666 16.992L15.345 16.992Z" />
                <path d="M19.425 10.344L24 10.344L18.435 8.784L19.425 10.344Z" />
              </svg>
              {UI_TEXT.connectGoogleDrive[language]}
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default BackupRestoreTab;
