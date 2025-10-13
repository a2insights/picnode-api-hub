import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flag, MapPin, Box, Sparkles } from 'lucide-react';

const apis = [
  {
    key: 'flags',
    icon: Flag,
    color: 'from-red-500 to-orange-500',
  },
  {
    key: 'places',
    icon: MapPin,
    color: 'from-green-500 to-emerald-500',
  },
  {
    key: 'logos',
    icon: Box,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    key: 'icons',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
  },
];

export const ApisSection = () => {
  const { t } = useTranslation();

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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('apis.title')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apis.map((api, index) => {
            const Icon = api.icon;
            return (
              <motion.div
                key={api.key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${api.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">
                        {t(`apis.${api.key}.title`)}
                      </h3>
                      <Badge variant="secondary" className="text-xs">API</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {t(`apis.${api.key}.description`)}
                    </p>
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
