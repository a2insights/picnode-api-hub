import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, RefreshCw, XCircle } from 'lucide-react';

export const TokensPage = () => {
  const { t } = useTranslation();

  const tokens = [
    {
      id: '1',
      token: 'pk_live_51234567890',
      scope: 'Flags, Icons',
      expiration: '2025-12-31',
      usage: '12.5K / 50K',
      status: 'active',
    },
    {
      id: '2',
      token: 'pk_live_98765432101',
      scope: 'Places, Logos',
      expiration: '2025-06-15',
      usage: '3.2K / 20K',
      status: 'active',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.myTokens')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('dashboard.tokens.table.token')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('dashboard.tokens.table.scope')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('dashboard.tokens.table.expiration')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('dashboard.tokens.table.usage')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('dashboard.tokens.table.status')}
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => (
                  <tr key={token.id} className="border-b border-border">
                    <td className="py-3 px-4">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {token.token}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-sm">{token.scope}</td>
                    <td className="py-3 px-4 text-sm">{token.expiration}</td>
                    <td className="py-3 px-4 text-sm">{token.usage}</td>
                    <td className="py-3 px-4">
                      <Badge variant={token.status === 'active' ? 'default' : 'secondary'}>
                        {t(`dashboard.tokens.status.${token.status}`)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
