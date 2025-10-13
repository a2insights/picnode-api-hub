import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const CalculatorSection = () => {
  const { t } = useTranslation();
  const [validity, setValidity] = useState([30]);
  const [rateLimit, setRateLimit] = useState([60]);
  const [totalRequests, setTotalRequests] = useState([10000]);

  const calculatePrice = () => {
    const basePrice = 0.01;
    const validityFactor = validity[0] / 30;
    const rateFactor = rateLimit[0] / 60;
    const requestsFactor = totalRequests[0] / 10000;
    
    return (basePrice * validityFactor * rateFactor * requestsFactor * 100).toFixed(2);
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
              <CardTitle className="text-3xl text-center">
                {t('calculator.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">{t('calculator.validity')}</label>
                  <span className="text-sm text-muted-foreground">{validity[0]} dias</span>
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

              <div className="pt-6 border-t border-border">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium">{t('calculator.estimatedPrice')}</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ${calculatePrice()}
                  </span>
                </div>
                <Button className="w-full gap-2 group" size="lg">
                  {t('calculator.proceed')}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
