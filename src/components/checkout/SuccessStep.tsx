import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SuccessStepProps {
  onClose: () => void;
  tokenConfig: {
    validity: number;
    limitType: 'rateLimit' | 'totalRequests';
    rateLimit: number;
    totalRequests: number;
  };
}

export const SuccessStep = ({ onClose, tokenConfig }: SuccessStepProps) => {
  const { t } = useTranslation();
  const generatedToken = `picnode_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const copyToken = () => {
    navigator.clipboard.writeText(generatedToken);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-green-500/50">
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto animate-scale-in" />
            <div>
              <h2 className="text-3xl font-bold text-green-500 mb-2">
                {t('checkout.success.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('checkout.success.subtitle')}
              </p>
            </div>
          </div>

          <div className="bg-secondary/50 p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg">{t('checkout.success.yourToken')}</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={generatedToken}
                readOnly
                className="flex-1 font-mono text-sm px-3 py-2 bg-background border rounded-md"
              />
              <Button onClick={copyToken} variant="outline">
                {t('checkout.success.copy')}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-sm">
                <span className="text-muted-foreground">{t('calculator.validity')}:</span>
                <p className="font-semibold">{tokenConfig.validity} {t('checkout.success.days')}</p>
              </div>
              {tokenConfig.limitType === 'rateLimit' ? (
                <div className="text-sm">
                  <span className="text-muted-foreground">{t('calculator.rateLimit')}:</span>
                  <p className="font-semibold">{tokenConfig.rateLimit} req/min</p>
                </div>
              ) : (
                <div className="text-sm">
                  <span className="text-muted-foreground">{t('calculator.totalRequests')}:</span>
                  <p className="font-semibold">{tokenConfig.totalRequests.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              <Download className="h-4 w-4 mr-2" />
              {t('checkout.success.download')}
            </Button>
            <Button className="flex-1" onClick={onClose}>
              {t('checkout.success.dashboard')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
