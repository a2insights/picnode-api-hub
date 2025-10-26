import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Download, Loader2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createToken } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface SuccessStepProps {
  onClose: () => void;
  tokenConfig: {
    validity: number;
    limitType: 'rateLimit' | 'totalRequests';
    rateLimit: number;
    totalRequests: number;
    apis: string[];
  };
  isFree?: boolean;
}

export const SuccessStep = ({ onClose, tokenConfig, isFree = false }: SuccessStepProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [generatedToken, setGeneratedToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExistingFree, setIsExistingFree] = useState(false);
  const hasCreatedToken = useRef(false);

  useEffect(() => {
    const fetchToken = async () => {
      if (hasCreatedToken.current) return;
      hasCreatedToken.current = true;

      try {
        setIsLoading(true);
        const tokenData = {
          name: `Token ${new Date().toLocaleString()}`,
          expires_in_days: tokenConfig.validity,
          allowed_apis: tokenConfig.apis,
          limit_type: tokenConfig.limitType === 'rateLimit' ? 'rate_limit' as const : 'total' as const,
          limit_value: tokenConfig.limitType === 'rateLimit' ? tokenConfig.rateLimit : tokenConfig.totalRequests,
        };

        const response = await createToken(tokenData);
        setGeneratedToken(response.token);
        
        // Trigger confetti after token is created
        triggerConfetti();
      } catch (error: any) {
        console.error('Error creating token:', error);
        if (error.response?.data?.message === 'You have already taken a free order before.') {
          setIsExistingFree(true);
        } else {
          toast({
            title: 'Erro ao criar token',
            description: error.response?.data?.message || 'Não foi possível criar o token. Tente novamente.',
            variant: 'destructive',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [tokenConfig, toast]);

  const triggerConfetti = () => {
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

    setTimeout(() => clearInterval(interval), duration);
  };

  const copyToken = () => {
    if (!generatedToken) return;
    navigator.clipboard.writeText(generatedToken);
    toast({
      title: 'Token copiado!',
      description: 'O token foi copiado para a área de transferência.',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-20 w-20 text-primary mx-auto animate-spin" />
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {t('checkout.success.creating')}
                </h2>
                <p className="text-muted-foreground">
                  Gerando seu token de acesso...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isExistingFree) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-yellow-500/50">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center space-y-4">
              <XCircle className="h-20 w-20 text-yellow-500 mx-auto animate-scale-in" />
              <div>
                <h2 className="text-3xl font-bold text-yellow-500 mb-2">
                  {t('checkout.success.alreadyClaimedTitle')}
                </h2>
                <p className="text-muted-foreground">
                  {t('checkout.success.alreadyClaimedSubtitle')}
                </p>
              </div>
            </div>
            <Button className="w-full" onClick={() => {
              onClose();
              navigate('/dashboard/tokens');
            }}>
              {t('checkout.success.dashboard')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-green-500/50">
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto animate-scale-in" />
            <div>
              <h2 className="text-3xl font-bold text-green-500 mb-2">
                {t(isFree ? 'checkout.success.titleFree' : 'checkout.success.title')}
              </h2>
              <p className="text-muted-foreground">
                {t(isFree ? 'checkout.success.subtitleFree' : 'checkout.success.subtitle')}
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
              <Button onClick={copyToken} variant="outline" disabled={!generatedToken}>
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
            <Button className="flex-1" onClick={() => {
              onClose();
              navigate('/dashboard/tokens');
            }}>
              {t('checkout.success.dashboard')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
