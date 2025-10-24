import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, RefreshCw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTokens } from '@/services/apiService';

interface Token {
  id: number | string;
  name: string;
  abilities: string[];
  plain_text_token: string;
  expires_at: string | null;
  usage: {
    limit_type: string;
    limit_value: number;
    usage: number;
  } | null;
  created_at: string;
  updated_at: string;
}

export const TokensPage = () => {
  const { t } = useTranslation();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await getTokens();
        if (Array.isArray(response)) {
          setTokens(response);
        } else if (response && Array.isArray(response.data)) {
          setTokens(response.data);
        } else {
          console.error('Unexpected response structure for tokens:', response);
          setTokens([]);
        }
      } catch (err) {
        setError(t('dashboard.tokens.table.errors.fetch'));
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [t]);

  if (loading) {
    return <div>{t('dashboard.tokens.table.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
                        {token.plain_text_token}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-sm">{token.abilities.join(', ')}</td>
                    <td className="py-3 px-4 text-sm">{token.expires_at ? new Date(token.expires_at).toLocaleDateString() : t('dashboard.tokens.table.never')}</td>
                    <td className="py-3 px-4 text-sm">{token.usage ? `${token.usage.usage} / ${token.usage.limit_value}` : 'N/A'}</td>
                    <td className="py-3 px-4">
                      <Badge variant={token.expires_at && new Date(token.expires_at) < new Date() ? 'secondary' : 'default'}>
                        {token.expires_at && new Date(token.expires_at) < new Date() ? t('dashboard.tokens.status.expired') : t('dashboard.tokens.status.active')}
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
