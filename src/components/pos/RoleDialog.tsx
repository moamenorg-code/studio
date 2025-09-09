import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Role, Permission } from '@/lib/types';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

type Language = 'en' | 'ar';

const PERMISSION_TEXT: Record<Permission, { en: string, ar: string }> = {
    access_dashboard: { en: 'Access Dashboard', ar: 'الوصول إلى لوحة التحكم' },
    access_sales_history: { en: 'Access Sales History', ar: 'الوصول إلى سجل المبيعات' },
    access_products: { en: 'Manage Products', ar: 'إدارة المنتجات' },
    access_inventory: { en: 'Manage Inventory', ar: 'إدارة المخزون' },
    access_customers: { en: 'Manage Customers', ar: 'إدارة العملاء' },
    access_purchases: { en: 'Manage Purchases', ar: 'إدارة المشتريات' },
    access_delivery: { en: 'Manage Delivery', ar: 'إدارة التوصيل' },
    access_shifts: { en: 'Manage Shifts', ar: 'إدارة الشفتات' },
    access_settings: { en: 'Access Settings', ar: 'الوصول إلى الإعدادات' },
    access_tables: { en: 'Manage Tables', ar: 'إدارة الطاولات' },
};


const UI_TEXT = {
  editRole: { en: 'Edit Role', ar: 'تعديل الدور' },
  addRole: { en: 'Add Role', ar: 'إضافة دور' },
  roleInfo: { en: 'Provide the role details below.', ar: 'أدخل تفاصيل الدور أدناه.' },
  name: { en: 'Role Name', ar: 'اسم الدور' },
  permissions: { en: 'Permissions', ar: 'الصلاحيات' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
};

interface RoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (role: Omit<Role, 'id'> | Role) => void;
  role: Role | null;
  language: Language;
}

const RoleDialog: React.FC<RoleDialogProps> = ({ isOpen, onOpenChange, onSave, role, language }) => {
  const [formData, setFormData] = React.useState<Partial<Role>>({ permissions: {} });

  React.useEffect(() => {
    if (isOpen) {
      if (role) {
        setFormData(JSON.parse(JSON.stringify(role))); // Deep copy
      } else {
        setFormData({
          name: '',
          permissions: {},
        });
      }
    }
  }, [role, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePermissionChange = (permission: Permission) => (checked: boolean) => {
    setFormData(prev => ({
        ...prev,
        permissions: {
            ...prev.permissions,
            [permission]: checked
        }
    }));
  };

  const handleSave = () => {
    if (formData.name) {
      onSave(formData as Role);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{role ? UI_TEXT.editRole[language] : UI_TEXT.addRole[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.roleInfo[language]}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{UI_TEXT.name[language]}</Label>
            <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} disabled={role?.id === 1} />
          </div>
          <div className="space-y-2">
            <Label>{UI_TEXT.permissions[language]}</Label>
            <ScrollArea className="h-60 rounded-md border p-4">
                <div className="space-y-4">
                    {Object.keys(PERMISSION_TEXT).map(pKey => {
                        const permissionKey = pKey as Permission;
                        return (
                            <div key={permissionKey} className="flex flex-row items-center justify-between">
                                <Label htmlFor={permissionKey} className="flex-1 font-normal">
                                    {PERMISSION_TEXT[permissionKey][language]}
                                </Label>
                                <Checkbox
                                    id={permissionKey}
                                    checked={!!formData.permissions?.[permissionKey]}
                                    onCheckedChange={handlePermissionChange(permissionKey)}
                                    disabled={role?.id === 1}
                                />
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{UI_TEXT.cancel[language]}</Button>
          <Button onClick={handleSave}>{UI_TEXT.save[language]}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDialog;
