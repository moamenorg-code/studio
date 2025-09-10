import * as React from 'react';
import { MoreHorizontal, PlusCircle, Shield, User as UserIcon } from 'lucide-react';
import type { User, Role, Permission } from '@/lib/types';
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
import { useToast } from '@/hooks/use-toast';
import UserDialog from './UserDialog';
import RoleDialog from './RoleDialog';
import { Badge } from '../ui/badge';
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
  deleteConfirmTitle: { en: 'Are you sure?', ar: 'هل أنت متأكد؟' },
  deleteUserConfirmDesc: { en: 'This action cannot be undone. This will permanently delete the user.', ar: 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف المستخدم نهائيًا.' },
  deleteRoleConfirmDesc: { en: 'This action cannot be undone. This will permanently delete the role.', ar: 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف الدور نهائيًا.' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  continue: { en: 'Continue', ar: 'متابعة' },
  deleteSuccess: { en: 'Deleted successfully', ar: 'تم الحذف بنجاح' },
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
  const [isUserDialogOpen, setUserDialogOpen] = React.useState(false);
  const [isRoleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);
  const { toast } = useToast();

  const getRoleName = (roleId: number) => {
    return roles.find(r => r.id === roleId)?.name || 'N/A';
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setUserDialogOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserDialogOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    onUsersChange(users.filter(u => u.id !== userId));
    toast({ title: UI_TEXT.deleteSuccess[language] });
  };
  
  const handleSaveUser = (user: Omit<User, 'id'> | User) => {
    if ('id' in user) {
      onUsersChange(users.map(u => u.id === user.id ? user : u));
    } else {
      const newUser = { ...user, id: Date.now() };
      onUsersChange([...users, newUser]);
    }
  };
  
  const handleAddRole = () => {
    setEditingRole(null);
    setRoleDialogOpen(true);
  };
  
  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleDialogOpen(true);
  };

  const handleDeleteRole = (roleId: number) => {
    onRolesChange(roles.filter(r => r.id !== roleId));
    onUsersChange(users.map(u => u.roleId === roleId ? { ...u, roleId: roles[0]?.id || 0 } : u));
    toast({ title: UI_TEXT.deleteSuccess[language] });
  };
  
  const handleSaveRole = (role: Omit<Role, 'id'> | Role) => {
    if ('id' in role) {
      onRolesChange(roles.map(r => r.id === role.id ? role : r));
    } else {
      const newRole = { ...role, id: Date.now() };
      onRolesChange([...roles, newRole]);
    }
  };

  return (
    <>
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
                <Button size="sm" onClick={handleAddUser}>
                    <PlusCircle className="me-2 h-4 w-4" />
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
                        <TableCell><Badge variant="secondary">{getRoleName(user.roleId)}</Badge></TableCell>
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
                            <DropdownMenuItem onSelect={() => handleEditUser(user)}>{UI_TEXT.edit[language]}</DropdownMenuItem>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">{UI_TEXT.delete[language]}</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{UI_TEXT.deleteConfirmTitle[language]}</AlertDialogTitle>
                                    <AlertDialogDescription>{UI_TEXT.deleteUserConfirmDesc[language]}</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{UI_TEXT.cancel[language]}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">{UI_TEXT.continue[language]}</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
                 <Button size="sm" onClick={handleAddRole}>
                    <PlusCircle className="me-2 h-4 w-4" />
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
                        <TableCell>{Object.values(role.permissions).filter(Boolean).length}</TableCell>
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
                            <DropdownMenuItem onSelect={() => handleEditRole(role)}>{UI_TEXT.edit[language]}</DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive" disabled={role.id === 1}>{UI_TEXT.delete[language]}</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{UI_TEXT.deleteConfirmTitle[language]}</AlertDialogTitle>
                                    <AlertDialogDescription>{UI_TEXT.deleteRoleConfirmDesc[language]}</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{UI_TEXT.cancel[language]}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteRole(role.id)} className="bg-destructive hover:bg-destructive/90">{UI_TEXT.continue[language]}</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
    
    <UserDialog 
        isOpen={isUserDialogOpen}
        onOpenChange={setUserDialogOpen}
        onSave={handleSaveUser}
        user={editingUser}
        roles={roles}
        language={language}
    />
    <RoleDialog
        isOpen={isRoleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onSave={handleSaveRole}
        role={editingRole}
        language={language}
    />
    </>
  );
};

export default UserManagement;
