import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PixCheckoutProps {
  price: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const PixCheckout = ({ price, onSuccess, onBack }: PixCheckoutProps) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPaid, setIsPaid] = useState(false);
  
  const pixCode = `00020126330014BR.GOV.BCB.PIX0111${Math.random().toString(36).substring(7)}520400005303986540${price}5802BR5913PicNode6009SAO PAULO62070503***63041D3D`;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPaid(true);
          setTimeout(() => {
            onSuccess();
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onSuccess]);

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast.success(t('checkout.pix.copied'));
  };

  return (
    <div className="max-w-md mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4" disabled={isPaid}>
        ← {t('checkout.pix.back')}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t('checkout.pix.title')}</CardTitle>
          <div className="text-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ${price}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isPaid ? (
            <>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {t('checkout.pix.expiresIn')}: <strong className="text-foreground">{timeLeft}s</strong>
                </span>
              </div>

              <div className="flex justify-center p-4 bg-white rounded-lg">
                <QRCodeSVG value={pixCode} size={200} level="H" />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-center text-muted-foreground">
                  {t('checkout.pix.scanQR')}
                </p>
                <div className="flex gap-2">
                  <Input
                    value={pixCode}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button size="icon" variant="outline" onClick={copyPixCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-center">
                  {t('checkout.pix.instructions')}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto animate-scale-in" />
              <div>
                <h3 className="text-xl font-bold text-green-500">
                  {t('checkout.pix.confirmed')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('checkout.pix.processing')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Input = ({ value, readOnly, className }: { value: string; readOnly: boolean; className: string }) => (
  <input
    type="text"
    value={value}
    readOnly={readOnly}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
);
