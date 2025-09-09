import * as React from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import type { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// TODO: Create a CustomerDialog component
// import CustomerDialog from './CustomerDialog';

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageCustomers: { en: 'Manage Customers', ar: 'إدارة العملاء' },
  manageYourCustomers: { en: 'View, add, edit, and remove your customers.', ar: 'عرض وإضافة وتعديل وحذف عملائك.' },
  addCustomer: { en: 'Add Customer', ar: 'إضافة عميل' },
  name: { en: 'Name', ar: 'الاسم' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  address: { en: 'Address', ar: 'العنوان' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  noCustomers: { en: 'No customers found.', ar: 'لم يتم العثور على عملاء.' },
};

interface CustomerManagementTabProps {
  customers: Customer[];
  onCustomersChange: (customers: Customer[]) => void;
  language: Language;
}

const CustomerManagementTab: React.FC<CustomerManagementTabProps> = ({ customers, onCustomersChange, language }) => {
  // TODO: Implement Dialog state
  // const [isDialogOpen, setDialogOpen] = React.useState(false);
  // const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null);

  const handleAddCustomer = () => {
    // setEditingCustomer(null);
    // setDialogOpen(true);
    alert('Add customer functionality not implemented yet.');
  };

  const handleEditCustomer = (customer: Customer) => {
    // setEditingCustomer(customer);
    // setDialogOpen(true);
     alert('Edit customer functionality not implemented yet.');
  };

  const handleDeleteCustomer = (customerId: number) => {
    onCustomersChange(customers.filter(c => c.id !== customerId));
  };
  
  const handleSaveCustomer = (customer: Customer) => {
    // ...
    // setDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{UI_TEXT.manageCustomers[language]}</CardTitle>
              <CardDescription>{UI_TEXT.manageYourCustomers[language]}</CardDescription>
            </div>
            <Button onClick={handleAddCustomer}>
              <PlusCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {UI_TEXT.addCustomer[language]}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{UI_TEXT.name[language]}</TableHead>
                <TableHead>{UI_TEXT.phone[language]}</TableHead>
                <TableHead>{UI_TEXT.address[language]}</TableHead>
                <TableHead>
                  <span className="sr-only">{UI_TEXT.actions[language]}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length > 0 ? (
                customers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell dir="ltr">{customer.phone}</TableCell>
                    <TableCell>{customer.address}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>{UI_TEXT.edit[language]}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)} className="text-destructive">{UI_TEXT.delete[language]}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {UI_TEXT.noCustomers[language]}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* <CustomerDialog 
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveCustomer}
        customer={editingCustomer}
        language={language}
      /> */}
    </>
  );
};

export default CustomerManagementTab;
