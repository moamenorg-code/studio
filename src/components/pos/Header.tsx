import * as React from 'react';
import { Bot, Languages, Moon, Sun, PauseCircle, Menu, LogOut, Database } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import type { ActiveView, Language, Permission, FirestoreStatus } from '@/lib/types';
import { UI_TEXT, VIEW_OPTIONS } from '@/lib/constants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';

const HEADER_UI_TEXT = {
  language: { en: 'Language', ar: 'اللغة' },
  english: { en: 'English', ar: 'English' },
  arabic: { en: 'العربية', ar: 'العربية' },
  smartRoundup: { en: 'Smart Roundup', ar: 'تقريب السعر الذكي' },
  toggleTheme: { en: 'Toggle theme', ar: 'تبديل السمة' },
  heldOrders: { en: 'Held Orders', ar: 'الطلبات المعلقة' },
  logout: { en: 'Logout', ar: 'تسجيل الخروج' },
  db_connecting: { en: 'Connecting to database...', ar: 'جارٍ الاتصال بقاعدة البيانات...' },
  db_connected: { en: 'Database connected', ar: 'قاعدة البيانات متصلة' },
  db_error: { en: 'Database connection error', ar: 'خطأ في الاتصال بقاعدة البيانات' },
};

interface HeaderProps {
  appName: string;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenSmartRoundup: () => void;
  onOpenHeldOrders: () => void;
  onLogout: () => void;
  heldOrdersCount: number;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  enableTables: boolean;
  isShiftOpen: boolean;
  hasPermission: (permission: Permission) => boolean;
  firestoreStatus: FirestoreStatus;
}

const Header: React.FC<HeaderProps> = ({
  appName,
  language,
  setLanguage,
  onOpenSmartRoundup,
  onOpenHeldOrders,
  onLogout,
  heldOrdersCount,
  activeView,
  setActiveView,
  enableTables,
  isShiftOpen,
  hasPermission,
  firestoreStatus,
}) => {
  const { setTheme } = useTheme();

  const availableViews = React.useMemo(() => {
    return VIEW_OPTIONS.filter(v => {
      if (v.value === 'tables' && !enableTables) return false;
      if (!v.permission) return true; // Sales view has no permission check
      return hasPermission(v.permission);
    })
  }, [enableTables, hasPermission]);


  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-card px-4 sm:px-6">
      <TooltipProvider>
        <div className="flex w-full items-center gap-4">
          {/* Buttons on the left */}
          <div className="flex items-center gap-2">
            <DropdownMenu dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9" disabled={!isShiftOpen}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{UI_TEXT.menu[language]}</span>
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[250px] p-0">
                  <ScrollArea className="h-auto max-h-[70vh]">
                      <div className="p-1">
                          {availableViews.map(({ value, label, icon: Icon }) => (
                          <DropdownMenuItem key={value} onSelect={() => setActiveView(value)} className="py-2.5 text-base">
                              <Icon className={language === 'ar' ? 'ms-3 h-5 w-5' : 'me-3 h-5 w-5'} />
                              <span className="flex-1">{UI_TEXT[label][language]}</span>
                          </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={onLogout} className="py-2.5 text-base text-destructive">
                              <LogOut className={language === 'ar' ? 'ms-3 h-5 w-5' : 'me-3 h-5 w-5'} />
                              <span className="flex-1">{HEADER_UI_TEXT.logout[language]}</span>
                          </DropdownMenuItem>
                      </div>
                  </ScrollArea>
              </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">{HEADER_UI_TEXT.toggleTheme[language]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {HEADER_UI_TEXT.language[language]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  {HEADER_UI_TEXT.english[language]}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')}>
                  {HEADER_UI_TEXT.arabic[language]}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSmartRoundup}
              className="gap-2"
              disabled={!isShiftOpen}
            >
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">
                {HEADER_UI_TEXT.smartRoundup[language]}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenHeldOrders}
              className="relative gap-2"
              disabled={!isShiftOpen}
            >
              <PauseCircle className="h-4 w-4" />
              <span className="hidden sm:inline">
                {HEADER_UI_TEXT.heldOrders[language]}
              </span>
              {heldOrdersCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{heldOrdersCount}</Badge>
              )}
            </Button>
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* App Name on the right */}
          <div className="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <div className={cn("h-2.5 w-2.5 rounded-full", 
                        firestoreStatus === 'connecting' && 'bg-yellow-400 animate-pulse',
                        firestoreStatus === 'connected' && 'bg-green-500',
                        firestoreStatus === 'error' && 'bg-red-500',
                      )}/>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {firestoreStatus === 'connecting' && <p>{HEADER_UI_TEXT.db_connecting[language]}</p>}
                  {firestoreStatus === 'connected' && <p>{HEADER_UI_TEXT.db_connected[language]}</p>}
                  {firestoreStatus === 'error' && <p>{HEADER_UI_TEXT.db_error[language]}</p>}
                </TooltipContent>
              </Tooltip>
            <h1 className="text-lg font-bold text-primary">{appName}</h1>
          </div>
        </div>
      </TooltipProvider>
    </header>
  );
};

export default Header;
