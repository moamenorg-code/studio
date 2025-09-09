import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Camera, CameraOff } from 'lucide-react';

type Language = 'en' | 'ar';

const UI_TEXT = {
  title: { en: 'Scan Barcode', ar: 'مسح الباركود' },
  description: { en: 'Point your camera at a barcode to scan it.', ar: 'وجه الكاميرا نحو الباركود لمسحه.' },
  noCamera: { en: 'Camera Not Supported', ar: 'الكاميرا غير مدعومة' },
  noCameraDesc: { en: 'Your browser does not support camera access or the BarcodeDetector API.', ar: 'متصفحك لا يدعم الوصول إلى الكاميرا أو واجهة BarcodeDetector.' },
  permissionDenied: { en: 'Camera Access Denied', ar: 'تم رفض الوصول إلى الكاميرا' },
  permissionDeniedDesc: { en: 'Please enable camera permissions in your browser settings to use this feature.', ar: 'يرجى تمكين أذونات الكاميرا في إعدادات متصفحك لاستخدام هذه الميزة.' },
};

interface BarcodeScannerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDetect: (barcode: string) => void;
  language: Language;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ isOpen, onOpenChange, onDetect, language }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
  const [isApiSupported, setIsApiSupported] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    if ('BarcodeDetector' in window && navigator.mediaDevices) {
      setIsApiSupported(true);
    } else {
      setIsApiSupported(false);
    }
  }, []);

  React.useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number | null = null;

    const cleanup = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };

    if (isOpen && isApiSupported) {
      // @ts-ignore
      const barcodeDetector = new window.BarcodeDetector({ formats: ['ean_13', 'qr_code', 'code_128', 'upc_a'] });

      const startScan = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }

          const detect = async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  onDetect(barcodes[0].rawValue);
                  cleanup();
                }
              } catch (e) {
                console.error("Barcode detection failed:", e);
              }
            }
            animationFrameId = requestAnimationFrame(detect);
          };
          detect();

        } catch (err) {
          console.error('Error accessing camera:', err);
          setHasPermission(false);
        }
      };

      startScan();
    }

    return cleanup;

  }, [isOpen, isApiSupported, onDetect, toast, language]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.title[language]}</DialogTitle>
          <DialogDescription>{UI_TEXT.description[language]}</DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video overflow-hidden rounded-md border bg-muted">
            <video ref={videoRef} className="h-full w-full object-cover" playsInline autoPlay muted />
            <div className="absolute inset-0 bg-black/20" />

            {!isApiSupported ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background">
                    <Alert variant="destructive" className="w-auto">
                        <CameraOff className="h-4 w-4" />
                        <AlertTitle>{UI_TEXT.noCamera[language]}</AlertTitle>
                        <AlertDescription>{UI_TEXT.noCameraDesc[language]}</AlertDescription>
                    </Alert>
                </div>
            ) : hasPermission === false ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-background">
                    <Alert variant="destructive" className="w-auto">
                        <CameraOff className="h-4 w-4" />
                        <AlertTitle>{UI_TEXT.permissionDenied[language]}</AlertTitle>
                        <AlertDescription>{UI_TEXT.permissionDeniedDesc[language]}</AlertDescription>
                    </Alert>
                </div>
            ) : hasPermission === null && (
                 <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <Camera className="h-10 w-10 animate-pulse" />
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
