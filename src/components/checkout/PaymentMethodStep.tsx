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

        <Card
          className="cursor-not-allowed bg-gray-100 dark:bg-gray-800 opacity-50"
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m10.4 12.6-2.8 4.4"></path><path d="m10.1 17-2.5-4.4"></path><path d="m14.1 17-2.5-4.4"></path><path d="M14.4 12.6 17 17"></path><path d="M12 12.6V17"></path><path d="M11.6 12.6a1 1 0 1 0-1-1 1 1 0 0 0 1 1Z"></path><path d="M14.6 12.6a1 1 0 1 0-1-1 1 1 0 0 0 1 1Z"></path></svg>
              </div>
              <div>
                <CardTitle>PayPal</CardTitle>
                <CardDescription>{t('checkout.payment.paypalDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('checkout.payment.comingSoon')}
            </p>
          </CardContent>
        </Card>

        {currency === 'BRL' && (
          <Card
            className="cursor-not-allowed bg-gray-100 dark:bg-gray-800 opacity-50"
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
                {t('checkout.payment.comingSoon')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
