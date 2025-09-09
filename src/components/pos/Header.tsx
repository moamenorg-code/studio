import * as React from 'react';
import { Bot, Languages, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Language = 'en' | 'ar';

const UI_TEXT = {
  language: { en: 'Language', ar: 'اللغة' },
  english: { en: 'English', ar: 'English' },
  arabic: { en: 'العربية', ar: 'العربية' },
  smartRoundup: { en: 'Smart Roundup', ar: 'تقريب السعر الذكي' },
  toggleTheme: { en: 'Toggle theme', ar: 'تبديل السمة' },
};

interface HeaderProps {
  appName: string;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenSmartRoundup: () => void;
}

const Header: React.FC<HeaderProps> = ({
  appName,
  language,
  setLanguage,
  onOpenSmartRoundup,
}) => {
  const { setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6 shrink-0">
      <h1 className="text-xl font-bold text-primary">{appName}</h1>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSmartRoundup}
          className="gap-2"
        >
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline">
            {UI_TEXT.smartRoundup[language]}
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">
                {UI_TEXT.language[language]}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'}>
            <DropdownMenuItem onClick={() => setLanguage('en')}>
              {UI_TEXT.english[language]}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ar')}>
              {UI_TEXT.arabic[language]}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">{UI_TEXT.toggleTheme[language]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
      </div>
    </header>
  );
};

export default Header;
