import * as React from 'react';
import { MoreHorizontal, PlusCircle, Shield, User as UserIcon } from 'lucide-react';
import type { User, Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Language = 'en' | 'ar';

const UI_TEXT = {
  users: { en: 'Users', ar: 'المستخدمون' },
  roles: { en: 'Roles', ar: 'الأدوار' },
  addUser: { en: 'Add User', ar: 'إضافة مستخدم' },
  addRole: { en: 'Add Role', ar: 'إضافة دور' },
  name: { en: 'Name', ar: 'الاسم' },
  role: { en: 'Role', ar: 'الدور' },
  pin: { en: 'PIN', ar: 'الرقم السري' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  noUsers: { en: 'No users found.', ar: 'لم يتم العثور على مستخدمين.' },
  noRoles: { en: 'No roles found.', ar: 'لم يتم العثور على أدوار.' },
  permissions: { en: 'Permissions', ar: 'الصلاحيات' },
};

interface UserManagementProps {
  users: User[];
  onUsersChange: (users: User[]) => void;
  roles: Role[];
  onRolesChange: (roles: Role[]) => void;
  language: Language;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onUsersChange,
  roles,
  onRolesChange,
  language,
}) => {
  const getRoleName = (roleId: number) => {
    return roles.find(r => r.id === roleId)?.name || 'N/A';
  };

  return (
    <Tabs defaultValue="users" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="users">
          <UserIcon className="w-4 h-4 me-2" />
          {UI_TEXT.users[language]}
        </TabsTrigger>
        <TabsTrigger value="roles">
          <Shield className="w-4 h-4 me-2" />
          {UI_TEXT.roles[language]}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <div className="rounded-md border mt-4">
            <div className="p-4 flex justify-end">
                <Button size="sm">
                    <PlusCircle className={language === 'ar' ? 'ml-2' : 'mr-2'} />
                    {UI_TEXT.addUser[language]}
                </Button>
            </div>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>{UI_TEXT.name[language]}</TableHead>
                    <TableHead>{UI_TEXT.role[language]}</TableHead>
                    <TableHead>{UI_TEXT.pin[language]}</TableHead>
                    <TableHead>
                    <span className="sr-only">{UI_TEXT.actions[language]}</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {users.length > 0 ? (
                    users.map(user => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{getRoleName(user.roleId)}</TableCell>
                        <TableCell>****</TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'}>
                            <DropdownMenuLabel>{UI_TEXT.actions[language]}</DropdownMenuLabel>
                            <DropdownMenuItem>{UI_TEXT.edit[language]}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">{UI_TEXT.delete[language]}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        {UI_TEXT.noUsers[language]}
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
      </TabsContent>
      <TabsContent value="roles">
         <div className="rounded-md border mt-4">
            <div className="p-4 flex justify-end">
                 <Button size="sm">
                    <PlusCircle className={language === 'ar' ? 'ml-2' : 'mr-2'} />
                    {UI_TEXT.addRole[language]}
                </Button>
            </div>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>{UI_TEXT.role[language]}</TableHead>
                    <TableHead>{UI_TEXT.permissions[language]}</TableHead>
                    <TableHead>
                    <span className="sr-only">{UI_TEXT.actions[language]}</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {roles.length > 0 ? (
                    roles.map(role => (
                    <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{Object.keys(role.permissions).length}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'}>
                            <DropdownMenuLabel>{UI_TEXT.actions[language]}</DropdownMenuLabel>
                            <DropdownMenuItem>{UI_TEXT.edit[language]}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">{UI_TEXT.delete[language]}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                        {UI_TEXT.noRoles[language]}
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default UserManagement;
