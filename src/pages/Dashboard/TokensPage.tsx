import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTokens, getOrder } from '@/services/apiService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { TokenCalculator } from '@/components/TokenCalculator';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

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
  const { toast } = useToast();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTokenDialogOpen, setNewTokenDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

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

  useEffect(() => {
    const checkOrderStatus = async () => {
      const orderId = searchParams.get('order_id');
      const success = searchParams.get('success');
      const cancel = searchParams.get('cancel');

      if (success && orderId) {
        try {
          const order = await getOrder(orderId);
          if (order.status === 'paid') {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
            toast({
              title: 'Payment Successful!',
              description: 'Your new token has been added to your account.',
            });
          } else {
            toast({
              title: 'Payment Processing',
              description: 'Your payment is being processed. We will update you shortly.',
            });
          }
        } catch (err) {
          toast({
            title: 'Error',
            description: 'Could not verify your order status.',
            variant: 'destructive',
          });
        }
        searchParams.delete('order_id');
        searchParams.delete('success');
        setSearchParams(searchParams);
      } else if (cancel) {
        toast({
          title: 'Payment Cancelled',
          description: 'Your payment was cancelled. You can try again anytime.',
          variant: 'destructive',
        });
        searchParams.delete('order_id');
        searchParams.delete('cancel');
        setSearchParams(searchParams);
      }
    };

    checkOrderStatus();
  }, [searchParams, setSearchParams, toast]);


  if (loading) {
    return <div>{t('dashboard.tokens.table.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      title: t('dashboard.tokens.actions.copy'),
      description: 'Token copiado para a área de transferência',
    });
  };

  const handleViewToken = (token: Token) => {
    setSelectedToken(token);
    setDialogOpen(true);
  };

  const handleNewTokenComplete = () => {
    setNewTokenDialogOpen(false);
    // Refresh tokens list
    const fetchTokens = async () => {
      try {
        const response = await getTokens();
        if (Array.isArray(response)) {
          setTokens(response);
        } else if (response && Array.isArray(response.data)) {
          setTokens(response.data);
        }
      } catch (err) {
        console.error('Error refreshing tokens:', err);
      }
    };
    fetchTokens();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('dashboard.myTokens')}</CardTitle>
            <Button onClick={() => setNewTokenDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('dashboard.tokens.newToken')}
            </Button>
          </div>
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
                    <td className="py-3 px-4 text-sm">{token.expires_at ? new Date(token.expires_at).toISOString().split('T')[0] : t('dashboard.tokens.table.never')}</td>
                    <td className="py-3 px-4 text-sm">{token.usage ? `${token.usage.usage} / ${token.usage.limit_value}` : 'N/A'}</td>
                    <td className="py-3 px-4">
                      <Badge variant={token.expires_at && new Date(token.expires_at) < new Date() ? 'secondary' : 'default'}>
                        {token.expires_at && new Date(token.expires_at) < new Date() ? t('dashboard.tokens.status.expired') : t('dashboard.tokens.status.active')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => copyToken(token.plain_text_token)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleViewToken(token)}>
                          <Eye className="h-4 w-4" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dashboard.tokens.viewDialog.title')}</DialogTitle>
          </DialogHeader>
          {selectedToken && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('dashboard.tokens.table.token')}</p>
                <code className="text-sm bg-muted px-2 py-1 rounded block break-all">
                  {selectedToken.plain_text_token}
                </code>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('dashboard.tokens.table.scope')}</p>
                <p className="text-sm font-medium">{selectedToken.abilities.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('dashboard.tokens.table.expiration')}</p>
                <p className="text-sm font-medium">
                  {selectedToken.expires_at ? new Date(selectedToken.expires_at).toISOString().split('T')[0] : t('dashboard.tokens.table.never')}
                </p>
              </div>
              {selectedToken.usage && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('dashboard.tokens.table.usage')}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('dashboard.tokens.viewDialog.used')}: {selectedToken.usage.usage}</span>
                      <span>{t('dashboard.thanks for the help')}: {selectedToken.usage.limit_value}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all" 
                        style={{ width: `${Math.min((selectedToken.usage.usage / selectedToken.usage.limit_value) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('dashboard.tokens.viewDialog.type')}: {selectedToken.usage.limit_type}
                    </p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('dashboard.tokens.table.status')}</p>
                <Badge variant={selectedToken.expires_at && new Date(selectedToken.expires_at) < new Date() ? 'secondary' : 'default'}>
                  {selectedToken.expires_at && new Date(selectedToken.expires_at) < new Date() ? t('dashboard.tokens.status.expired') : t('dashboard.tokens.status.active')}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={newTokenDialogOpen} onOpenChange={setNewTokenDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('dashboard.tokens.newToken')}</DialogTitle>
          </DialogHeader>
          <TokenCalculator showTitle={false} onComplete={handleNewTokenComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};