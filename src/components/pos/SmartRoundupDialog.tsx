import * as React from 'react';
import { useActionState } from 'react';
import { runSmartRoundup, type RoundupState } from '@/app/actions';

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
import { Bot, Sparkles } from 'lucide-react';

type Language = 'en' | 'ar';

const UI_TEXT = {
  title: { en: 'Smart Price Roundup', ar: 'تقريب السعر الذكي' },
  description: { en: 'Use AI to find a more customer-friendly price.', ar: 'استخدم الذكاء الاصطناعي لإيجاد سعر أكثر جاذبية للعملاء.' },
  originalPrice: { en: 'Original Price', ar: 'السعر الأصلي' },
  getSuggestion: { en: 'Get Suggestion', ar: 'احصل على اقتراح' },
  gettingSuggestion: { en: 'Getting Suggestion...', ar: 'جاري الحصول على الاقتراح...' },
  suggestedPrice: { en: 'Suggested Price', ar: 'السعر المقترح' },
  reasoning: { en: 'Reasoning', ar: 'السبب' },
  close: { en: 'Close', ar: 'إغلاق' },
};

interface SmartRoundupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
}

function SubmitButton({ language, isPending }: { language: Language, isPending: boolean }) {
  return (
    <Button type="submit" disabled={true} className="w-full">
      {isPending ? (
        <>
          <Sparkles className={language === 'ar' ? "ml-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4 animate-spin"} />
          {UI_TEXT.gettingSuggestion[language]}
        </>
      ) : (
        <>
          <Bot className={language === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
          {UI_TEXT.getSuggestion[language]}
        </>
      )}
    </Button>
  );
}

const SmartRoundupDialog: React.FC<SmartRoundupDialogProps> = ({ isOpen, onOpenChange, language }) => {
  const [state, formAction, isPending] = useActionState(runSmartRoundup, undefined);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [localState, setLocalState] = React.useState<RoundupState | undefined>(undefined);

  React.useEffect(() => {
    setLocalState(state);
  }, [state]);

  React.useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset();
      setLocalState(undefined);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.title[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.description[language]}</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="price">{UI_TEXT.originalPrice[language]}</Label>
            <Input id="price" name="price" type="number" step="0.01" required dir="ltr" disabled={true} />
            {localState?.errors?.price && (
              <p className="mt-1 text-sm text-destructive">{localState.errors.price[0]}</p>
            )}
          </div>
          <SubmitButton language={language} isPending={isPending} />
        </form>

        {localState?.result && (
          <div className="mt-4 space-y-4 rounded-lg border bg-muted p-4">
            <div>
              <h3 className="font-semibold">{UI_TEXT.suggestedPrice[language]}</h3>
              <p className="text-2xl font-bold text-primary">{localState.result.roundedPrice.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold">{UI_TEXT.reasoning[language]}</h3>
              <p className="text-sm text-muted-foreground">{localState.result.reason}</p>
            </div>
          </div>
        )}
        
        {localState?.message && (
             <p className="mt-1 text-sm text-destructive">{localState.message}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{UI_TEXT.close[language]}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SmartRoundupDialog;
