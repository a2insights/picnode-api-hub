import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Landmark,
  DollarSign,
  Trophy,
  GraduationCap,
  Coffee,
  Smartphone,
  Plane,
  Car,
  Shield,
  Award,
  Sparkles,
  Tv,
  Share2,
  Bitcoin,
  Cloud,
  LucideIcon,
} from 'lucide-react';
import staticApis from '@/data/static-apis.json';

const iconMap: { [key: string]: LucideIcon } = {
  Landmark,
  DollarSign,
  Trophy,
  GraduationCap,
  Coffee,
  Smartphone,
  Plane,
  Car,
  Shield,
  Award,
  Sparkles,
  Tv,
  Share2,
  Bitcoin,
  Cloud,
};

export const ApisInDevelopment = () => {
  const { t } = useTranslation();
  const { inDevelopment } = staticApis;

  return (
    <section className="py-24 px-4 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
            Coming Soon
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            APIs in Development
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're constantly expanding our API offerings. Here's what we're working on next.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inDevelopment.map((api, index) => {
            const Icon = iconMap[api.icon] || Sparkles;

            return (
              <motion.div
                key={api.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${api.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {api.category}
                      </Badge>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-semibold mb-2">{api.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{api.description}</p>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-primary">{api.progress}%</span>
                      </div>
                      <Progress value={api.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Est. completion: {api.estimatedCompletion}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{inDevelopment.length} APIs</span>{' '}
            currently in development • Avg. completion:{' '}
            <span className="font-semibold text-foreground">
              {Math.round(
                inDevelopment.reduce((acc, api) => acc + api.progress, 0) / inDevelopment.length,
              )}
              %
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
