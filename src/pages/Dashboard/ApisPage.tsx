import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { availableApis } from '@/lib/apis';

export const ApisPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.availableApis')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {availableApis.map((api, index) => {
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
                          <p>{t('dashboard.apisTable.basePrice')}: ${api.basePrice}/req</p>
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
