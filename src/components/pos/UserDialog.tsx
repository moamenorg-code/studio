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
import { User, Role } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Language = 'en' | 'ar';

const UI_TEXT = {
  editUser: { en: 'Edit User', ar: 'تعديل المستخدم' },
  addUser: { en: 'Add User', ar: 'إضافة مستخدم' },
  userInfo: { en: 'Provide the user details below.', ar: 'أدخل تفاصيل المستخدم أدناه.' },
  name: { en: 'Name', ar: 'الاسم' },
  pin: { en: 'PIN (4 digits)', ar: 'الرقم السري (4 أرقام)' },
  role: { en: 'Role', ar: 'الدور' },
  selectRole: { en: 'Select a role', ar: 'اختر دورًا' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save', ar: 'حفظ' },
};

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: Omit<User, 'id'> | User) => void;
  user: User | null;
  roles: Role[];
  language: Language;
}

const UserDialog: React.FC<UserDialogProps> = ({ isOpen, onOpenChange, onSave, user, roles, language }) => {
  const [formData, setFormData] = React.useState<Partial<User>>({});

  React.useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData(user);
      } else {
        setFormData({
          name: '',
          pin: '',
          roleId: undefined,
        });
      }
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'pin' && value.length > 4) return;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
        ...prev,
        roleId: Number(value),
    }));
  };

  const handleSave = () => {
    if (formData.name && formData.pin?.length === 4 && formData.roleId) {
      onSave(formData as User);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? UI_TEXT.editUser[language] : UI_TEXT.addUser[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.userInfo[language]}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{UI_TEXT.name[language]}</Label>
            <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pin">{UI_TEXT.pin[language]}</Label>
            <Input id="pin" name="pin" type="password" value={formData.pin || ''} onChange={handleChange} dir="ltr" maxLength={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roleId">{UI_TEXT.role[language]}</Label>
            <Select onValueChange={handleRoleChange} value={String(formData.roleId || '')}>
                <SelectTrigger id="roleId">
                    <SelectValue placeholder={UI_TEXT.selectRole[language]} />
                </SelectTrigger>
                <SelectContent>
                    {roles.map(role => (
                        <SelectItem key={role.id} value={String(role.id)} disabled={user?.id === 1 && role.id !== 1}>
                            {role.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
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

export default UserDialog;
