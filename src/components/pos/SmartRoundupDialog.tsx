import * as React from 'react';
import { useFormStatus } from 'react-dom';
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

function SubmitButton({ language }: { language: Language }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Sparkles className="me-2 h-4 w-4 animate-spin" />
          {UI_TEXT.gettingSuggestion[language]}
        </>
      ) : (
        <>
          <Bot className="me-2 h-4 w-4" />
          {UI_TEXT.getSuggestion[language]}
        </>
      )}
    </Button>
  );
}

const SmartRoundupDialog: React.FC<SmartRoundupDialogProps> = ({ isOpen, onOpenChange, language }) => {
  const [state, setState] = React.useState<RoundupState>({});
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset();
      setState({});
    }
  }, [isOpen]);

  const handleAction = async (formData: FormData) => {
    const result = await runSmartRoundup(undefined, formData);
    setState(result);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.title[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.description[language]}</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleAction} className="space-y-4">
          <div>
            <Label htmlFor="price">{UI_TEXT.originalPrice[language]}</Label>
            <Input id="price" name="price" type="number" step="0.01" required dir="ltr" />
            {state?.errors?.price && (
              <p className="mt-1 text-sm text-destructive">{state.errors.price[0]}</p>
            )}
          </div>
          <SubmitButton language={language} />
        </form>

        {state?.result && (
          <div className="mt-4 space-y-4 rounded-lg border bg-muted p-4">
            <div>
              <h3 className="font-semibold">{UI_TEXT.suggestedPrice[language]}</h3>
              <p className="text-2xl font-bold text-primary">{state.result.roundedPrice.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold">{UI_TEXT.reasoning[language]}</h3>
              <p className="text-sm text-muted-foreground">{state.result.reason}</p>
            </div>
          </div>
        )}
        
        {state?.message && !state.result && state.message !== 'Success' &&(
             <p className="mt-1 text-sm text-destructive">{state.message}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{UI_TEXT.close[language]}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SmartRoundupDialog;
