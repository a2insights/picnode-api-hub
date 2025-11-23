import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flag, MapPin, Box, Sparkles, LucideIcon, Globe, Shield, MapPinCheck } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { MultilingualBadge } from '@/components/MultilingualBadge';

const iconMap: { [key: string]: LucideIcon } = {
  Flag,
  MapPin,
  Box,
  Sparkles,
  Globe,
  Shield,
  MapPinCheck,
};

export const ApisSection = () => {
  const { t } = useTranslation();
  const { apis } = useAppContext();

  return (
    <section id="apis" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('apis.title')}</h2>
        </motion.div>

        <div className="flex gap-6 overflow-x-auto pb-8 px-4 -mx-4 snap-x scrollbar-none">
          {apis.map((api, index) => {
            const Icon = iconMap[api.icon] || Box;
            return (
              <motion.div
                key={api.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="min-w-[300px] md:min-w-[320px] snap-center first:pl-4 last:pr-4"
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${api.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{api.name}</h3>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          API
                        </Badge>
                        {api.features?.languages && (
                          <MultilingualBadge languages={api.features.languages} />
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">{api.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
