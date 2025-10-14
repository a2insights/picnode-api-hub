import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, QrCode } from 'lucide-react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'BRL';

const currencyConfig: Record<Currency, { symbol: string }> = {
  USD: { symbol: '$' },
  EUR: { symbol: '€' },
  GBP: { symbol: '£' },
  BRL: { symbol: 'R$' },
};

interface PaymentMethodStepProps {
  onSelectMethod: (method: 'card' | 'pix') => void;
  price: string;
  currency?: Currency;
}

export const PaymentMethodStep = ({ onSelectMethod, price, currency = 'USD' }: PaymentMethodStepProps) => {
  const { t } = useTranslation();
  const currencyInfo = currencyConfig[currency];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{t('checkout.payment.title')}</h2>
        <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {currencyInfo.symbol}{price}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card 
          className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
          onClick={() => onSelectMethod('card')}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{t('checkout.payment.card')}</CardTitle>
                <CardDescription>{t('checkout.payment.cardDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('checkout.payment.cardInfo')}
            </p>
          </CardContent>
        </Card>

        {currency === 'BRL' && (
          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => onSelectMethod('pix')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{t('checkout.payment.pix')}</CardTitle>
                  <CardDescription>{t('checkout.payment.pixDescription')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('checkout.payment.pixInfo')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
