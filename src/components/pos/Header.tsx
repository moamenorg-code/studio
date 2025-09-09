import * as React from 'react';
import { Bot, Languages } from 'lucide-react';
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
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('en')}>
              {UI_TEXT.english[language]}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ar')}>
              {UI_TEXT.arabic[language]}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
