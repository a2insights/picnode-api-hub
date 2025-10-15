import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { ArrowRight, Sparkles } from 'lucide-react';
import { availableApis } from '@/lib/apis';
import { CheckoutModal } from './CheckoutModal';

type Currency = 'USD' | 'EUR' | 'GBP' | 'BRL';

const currencyConfig = {
  USD: { rate: 1, symbol: '$' },
  EUR: { rate: 0.93, symbol: '€' },
  GBP: { rate: 0.79, symbol: '£' },
  BRL: { rate: 5.40, symbol: 'R$' },
};

export const CalculatorSection = () => {
  const { t } = useTranslation();
  const [validity, setValidity] = useState([30]);
  const [limitType, setLimitType] = useState<'rateLimit' | 'totalRequests'>('rateLimit');
  const [rateLimit, setRateLimit] = useState([60]);
  const [totalRequests, setTotalRequests] = useState([10000]);
  const [selectedApis, setSelectedApis] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const isFreeThier = validity[0] === 7 && totalRequests[0] === 500 && limitType === 'totalRequests';

  const handleApiChange = (apiId: string) => {
    setSelectedApis(prev =>
      prev.includes(apiId) ? prev.filter(id => id !== apiId) : [...prev, apiId]
    );
  };

  const setFreeThier = () => {
    setValidity([7]);
    setTotalRequests([500]);
    setLimitType('totalRequests');
  };

  const calculatePrice = () => {
    const basePrice = 0.01; // Base price in USD
    const validityFactor = validity[0] / 30;
    const limitFactor = limitType === 'rateLimit' 
      ? rateLimit[0] / 60 
      : totalRequests[0] / 10000;
    
    const apiFactor = selectedApis.reduce((acc, apiId) => {
      const api = availableApis.find(a => a.id === apiId);
      return acc * (api ? api.priceFactor : 1);
    }, 1);

    const priceInUsd = basePrice * validityFactor * limitFactor * apiFactor * 100;
    const finalPrice = priceInUsd * currencyConfig[currency].rate;
    
    const formattedPrice = finalPrice.toFixed(2);
    if (currency === 'BRL') {
      return formattedPrice.replace('.', ',');
    }
    return formattedPrice;
  };

  return (
    <section id="calculator" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl">
                  {t('calculator.title')}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={setFreeThier}>
                  {t('calculator.freeTier')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-medium">{t('calculator.currency')}</label>
                <ToggleGroup 
                  type="single" 
                  value={currency} 
                  onValueChange={(value: Currency) => value && setCurrency(value)}
                  className="justify-start"
                >
                  <ToggleGroupItem value="USD">USD</ToggleGroupItem>
                  <ToggleGroupItem value="EUR">EUR</ToggleGroupItem>
                  <ToggleGroupItem value="GBP">GBP</ToggleGroupItem>
                  <ToggleGroupItem value="BRL">BRL</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">{t('calculator.apis')}</label>
                <div className="grid grid-cols-2 gap-4">
                  {availableApis.map(api => (
                    <div key={api.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={api.id}
                        checked={selectedApis.includes(api.id)}
                        onCheckedChange={() => handleApiChange(api.id)}
                      />
                      <Label htmlFor={api.id} className="cursor-pointer">{api.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">{t('calculator.validity')}</label>
                  <span className="text-sm text-muted-foreground">{validity[0]} {t('checkout.success.days')}</span>
                </div>
                <Slider
                  value={validity}
                  onValueChange={setValidity}
                  min={7}
                  max={365}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">{t('calculator.limitType')}</label>
                <RadioGroup value={limitType} onValueChange={(value) => setLimitType(value as 'rateLimit' | 'totalRequests')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rateLimit" id="rateLimit" />
                    <Label htmlFor="rateLimit" className="cursor-pointer">{t('calculator.rateLimit')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="totalRequests" id="totalRequests" />
                    <Label htmlFor="totalRequests" className="cursor-pointer">{t('calculator.totalRequests')}</Label>
                  </div>
                </RadioGroup>
              </div>

              {limitType === 'rateLimit' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">{t('calculator.rateLimit')}</label>
                    <span className="text-sm text-muted-foreground">{rateLimit[0]} req/min</span>
                  </div>
                  <Slider
                    value={rateLimit}
                    onValueChange={setRateLimit}
                    min={10}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                </div>
              )}

              {limitType === 'totalRequests' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">{t('calculator.totalRequests')}</label>
                    <span className="text-sm text-muted-foreground">
                      {totalRequests[0].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={totalRequests}
                    onValueChange={setTotalRequests}
                    min={1000}
                    max={1000000}
                    step={1000}
                    className="w-full"
                  />
                </div>
              )}

              <div className="pt-6 border-t border-border">
                {!isFreeThier && (
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-medium">{t('calculator.estimatedPrice')}</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {currencyConfig[currency].symbol}{calculatePrice()}
                    </span>
                  </div>
                )}
                {isFreeThier ? (
                  <Button className="w-full gap-2 group" size="lg" onClick={() => setCheckoutOpen(true)}>
                    <Sparkles className="h-5 w-5" />
                    {t('calculator.getFreeToken')}
                  </Button>
                ) : (
                  <Button className="w-full gap-2 group" size="lg" onClick={() => setCheckoutOpen(true)}>
                    {t('calculator.proceed')}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        tokenConfig={{
          validity: validity[0],
          limitType,
          rateLimit: rateLimit[0],
          totalRequests: totalRequests[0],
          apis: selectedApis,
        }}
        price={calculatePrice()}
        currency={currency}
        isFree={isFreeThier}
      />
    </section>
  );
};
