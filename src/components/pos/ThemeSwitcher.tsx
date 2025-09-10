import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Check, Laptop, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Language = 'en' | 'ar';

const THEMES = [
  { name: 'light', label: { en: 'Light', ar: 'فاتح' }, icon: Sun },
  { name: 'dark', label: { en: 'Dark', ar: 'داكن' }, icon: Moon },
  { name: 'system', label: { en: 'System', ar: 'النظام' }, icon: Laptop },
];

const COLORS = [
  { name: 'blue', label: {en: 'Google', ar: 'جوجل'}, color: 'hsl(217.2 91.2% 59.8%)' },
  { name: 'rose', label: {en: 'Rose', ar: 'وردي'}, color: 'hsl(346.8 77.2% 49.8%)' },
  { name: 'green', label: {en: 'Green', ar: 'أخضر'}, color: 'hsl(142.1 76.2% 36.3%)' },
  { name: 'orange', label: {en: 'Orange', ar: 'برتقالي'}, color: 'hsl(24.6 95% 53.1%)' },
];

const UI_TEXT = {
  theme: { en: 'Theme', ar: 'السمة' },
  customizeAppearance: { en: 'Customize the appearance of the app.', ar: 'تخصيص مظهر التطبيق.' },
  color: { en: 'Color', ar: 'اللون' },
  mode: { en: 'Mode', ar: 'الوضع' },
  changeTheme: { en: 'Change Theme', ar: 'تغيير السمة' },
};


const ThemeSwitcher: React.FC<{ language: Language }> = ({ language }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const handleColorChange = (newColor: string) => {
      document.body.classList.forEach(className => {
        if (className.startsWith('theme-')) {
          document.body.classList.remove(className);
        }
      });
      if (newColor !== 'blue') {
        document.body.classList.add(`theme-${newColor}`);
      }
      setTheme(newColor);
  };
  
  const handleModeChange = (mode: string) => {
     setTheme(mode);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{UI_TEXT.theme[language]}</h3>
        <p className="text-sm text-muted-foreground">{UI_TEXT.customizeAppearance[language]}</p>
      </div>

      <div className="space-y-2">
        <Label>{UI_TEXT.color[language]}</Label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <Button
              key={c.name}
              variant="outline"
              size="sm"
              onClick={() => handleColorChange(c.name)}
              className={cn(
                'justify-start',
                (theme === c.name || (theme === 'light' || theme === 'dark' || theme === 'system') && c.name === 'blue') && 'border-2 border-primary'
              )}
              style={{ '--theme-primary': c.color } as React.CSSProperties}
            >
              <span
                className="mr-2 rounded-full h-5 w-5 flex items-center justify-center"
                style={{ backgroundColor: c.color }}
              >
               {(theme === c.name || (theme === 'light' || theme === 'dark' || theme === 'system') && c.name === 'blue') && <Check className="h-4 w-4 text-white" />}
              </span>
              {c.label[language]}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
         <Label>{UI_TEXT.mode[language]}</Label>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {THEMES.map((t) => (
            <Button
              key={t.name}
              variant={theme === t.name ? 'default' : 'outline'}
              size="lg"
              onClick={() => handleModeChange(t.name)}
              className="w-full"
            >
              <t.icon className="me-2 h-4 w-4" />
              {t.label[language]}
            </Button>
          ))}
         </div>
      </div>
       
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{UI_TEXT.changeTheme[language]}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{UI_TEXT.mode[language]}</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {THEMES.map((t) => (
                    <DropdownMenuItem key={t.name} onSelect={() => setTheme(t.name)}>
                        <t.icon className="mr-2 h-4 w-4" />
                        <span>{t.label[language]}</span>
                    </DropdownMenuItem>
                ))}
                 <DropdownMenuSeparator/>
                <DropdownMenuLabel>{UI_TEXT.color[language]}</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {COLORS.map((c) => (
                    <DropdownMenuItem key={c.name} onSelect={() => {
                       document.body.classList.forEach(className => {
                          if (className.startsWith('theme-')) {
                            document.body.classList.remove(className);
                          }
                        });
                        if (c.name !== 'blue') {
                           document.body.classList.add(`theme-${c.name}`);
                        }
                       setTheme(c.name);
                    }}>
                         <div className="w-4 h-4 mr-2 rounded-full" style={{backgroundColor: c.color}} />
                        <span>{c.label[language]}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>

    </div>
  );
};

export default ThemeSwitcher;
