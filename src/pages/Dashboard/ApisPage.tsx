import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flag, MapPin, Box, Sparkles } from 'lucide-react';

export const ApisPage = () => {
  const { t } = useTranslation();

  const apis = [
    {
      name: 'Flags API',
      type: 'Images',
      icon: Flag,
      basePrice: '$0.001/req',
      availability: 'Available',
      color: 'from-red-500 to-orange-500',
    },
    {
      name: 'Places API',
      type: 'Images',
      icon: MapPin,
      basePrice: '$0.002/req',
      availability: 'Available',
      color: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Logos API',
      type: 'Vectors',
      icon: Box,
      basePrice: '$0.0015/req',
      availability: 'Available',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Icons API',
      type: 'Vectors',
      icon: Sparkles,
      basePrice: '$0.0005/req',
      availability: 'Available',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.availableApis')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {apis.map((api, index) => {
              const Icon = api.icon;
              return (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${api.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{api.name}</h3>
                          <Badge variant="secondary" className="text-xs">{api.type}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>{t('dashboard.apisTable.basePrice')}: {api.basePrice}</p>
                          <p>{t('dashboard.apisTable.availability')}: <span className="text-green-500">{api.availability}</span></p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
