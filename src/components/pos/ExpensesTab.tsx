import * as React from 'react';
import { PlusCircle } from 'lucide-react';
import type { Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import ExpenseDialog from './ExpenseDialog';

type Language = 'en' | 'ar';

const UI_TEXT = {
  manageExpenses: { en: 'Manage Expenses', ar: 'إدارة المصروفات' },
  trackExpenses: { en: 'Record and view your business expenses.', ar: 'سجل واعرض مصروفات نشاطك التجاري.' },
  addExpense: { en: 'Add Expense', ar: 'إضافة مصروف' },
  description: { en: 'Description', ar: 'الوصف' },
  amount: { en: 'Amount', ar: 'المبلغ' },
  date: { en: 'Date', ar: 'التاريخ' },
  noExpenses: { en: 'No expenses found.', ar: 'لم يتم العثور على مصروفات.' },
};

interface ExpensesTabProps {
  expenses: Expense[];
  onExpensesChange: (expenses: Expense[]) => void;
  language: Language;
}

const ExpensesTab: React.FC<ExpensesTabProps> = ({ expenses, onExpensesChange, language }) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const handleSaveExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now(),
      createdAt: new Date(),
    };
    onExpensesChange([...expenses, newExpense]);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{UI_TEXT.manageExpenses[language]}</CardTitle>
              <CardDescription>{UI_TEXT.trackExpenses[language]}</CardDescription>
            </div>
            <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
              <PlusCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {UI_TEXT.addExpense[language]}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{UI_TEXT.description[language]}</TableHead>
                  <TableHead>{UI_TEXT.date[language]}</TableHead>
                  <TableHead className="text-end">{UI_TEXT.amount[language]}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length > 0 ? (
                  expenses.map(expense => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(expense.createdAt)}
                      </TableCell>
                      <TableCell className="text-end">{expense.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      {UI_TEXT.noExpenses[language]}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <ExpenseDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveExpense}
        language={language}
      />
    </>
  );
};

export default ExpensesTab;
