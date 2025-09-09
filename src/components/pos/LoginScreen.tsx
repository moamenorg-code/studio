import * as React from 'react';
import { User } from '@/lib/types';
import { Button } from '../ui/button';
import { X, Delete, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { AnimatePresence, motion } from 'framer-motion';

type Language = 'en' | 'ar';

const UI_TEXT = {
    title: { en: 'Enter PIN', ar: 'أدخل الرقم السري' },
    description: { en: 'Please enter your 4-digit PIN to login.', ar: 'الرجاء إدخال الرقم السري المكون من 4 أرقام لتسجيل الدخول.' },
    welcome: { en: 'Welcome', ar: 'أهلاً بك' },
};

const NUMPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

interface LoginScreenProps {
  onLogin: (pin: string) => void;
  users: User[];
  language: Language;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, users, language }) => {
  const [pin, setPin] = React.useState('');
  const [matchedUser, setMatchedUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (pin.length === 4) {
      onLogin(pin);
      // Optional: Clear pin after a delay to show success/failure
      setTimeout(() => setPin(''), 1000);
    }
  }, [pin, onLogin]);

  React.useEffect(() => {
    const user = users.find(u => u.pin === pin);
    setMatchedUser(user || null);
  }, [pin, users]);

  const handleKeyPress = (key: string) => {
    if (key === 'C') {
      setPin('');
    } else if (key === '⌫') {
      setPin(p => p.slice(0, -1));
    } else if (pin.length < 4) {
      setPin(p => p + key);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={matchedUser ? matchedUser.id : 'pin-input'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center"
                >
                    {matchedUser ? (
                        <>
                            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                            <CardTitle className="text-2xl">{UI_TEXT.welcome[language]}, {matchedUser.name}!</CardTitle>
                        </>
                    ) : (
                        <>
                            <CardTitle>{UI_TEXT.title[language]}</CardTitle>
                            <CardDescription>{UI_TEXT.description[language]}</CardDescription>
                        </>
                    )}
                </motion.div>
             </AnimatePresence>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center gap-4 my-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                className={`h-4 w-4 rounded-full border-2 ${pin.length > index ? 'bg-primary border-primary' : 'border-muted-foreground'}`}
                animate={pin.length === index ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {NUMPAD_KEYS.map(key => (
              <Button
                key={key}
                variant="outline"
                className="h-16 text-2xl font-bold"
                onClick={() => handleKeyPress(key)}
              >
                {key === '⌫' ? <Delete /> : key}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
