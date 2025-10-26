import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getOrders } from '@/services/apiService';
import { toast } from '@/components/ui/use-toast';

interface Order {
  id: number;
  user_id: number;
  stripe_checkout_session_id: string;
  status: string;
  total: string;
  currency: string;
  allowed_apis: string[];
  limit_type: string;
  limit_value: number;
  expires_in_days: number | null;
  created_at: string;
  updated_at: string;
}

interface OrdersResponse {
  current_page: number;
  data: Order[];
  last_page: number;
  per_page: number;
  total: number;
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline',
  paid: 'default',
  failed: 'destructive',
  cancelled: 'secondary',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  paid: 'bg-green-500/10 text-green-500',
  failed: 'bg-red-500/10 text-red-500',
  cancelled: 'bg-gray-500/10 text-gray-500',
};

export const OrdersPage = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (page: number) => {
    setLoading(true);
    try {
      const response: OrdersResponse = await getOrders(page);
      setOrders(response.data);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: t('dashboard.orders.errorTitle'),
        description: t('dashboard.orders.errorDescription'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const formatCurrency = (amount: string, currency: string) => {
    const symbols: Record<string, string> = {
      usd: '$',
      eur: '€',
      gbp: '£',
      brl: 'R$',
    };
    return `${symbols[currency.toLowerCase()] || '$'}${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
                    <CardHeader>
                      <CardTitle>{t('dashboard.ordersTitle')}</CardTitle>
                    </CardHeader>        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t('dashboard.orders.noOrders')}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        {t('dashboard.ordersTable.date')}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        {t('dashboard.ordersTable.apis')}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        {t('dashboard.ordersTable.limit')}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        {t('dashboard.ordersTable.total')}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        {t('dashboard.ordersTable.status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border">
                        <td className="py-3 px-4 text-sm">{formatDate(order.created_at)}</td>
                        <td className="py-3 px-4">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            #{order.id}
                          </code>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {order.allowed_apis.map((api, idx) => (
                              <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                                {api}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {order.limit_type === 'total' 
                            ? `${order.limit_value.toLocaleString()} total` 
                            : `${order.limit_value}/min`}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {formatCurrency(order.total, order.currency)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="default" className={statusColors[order.status] || statusColors.pending}>
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {lastPage > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchOrders(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t('dashboard.ordersTable.previous')}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {t('dashboard.ordersTable.page')} {currentPage} {t('dashboard.ordersTable.of')} {lastPage}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchOrders(currentPage + 1)}
                    disabled={currentPage === lastPage || loading}
                  >
                    {t('dashboard.ordersTable.next')}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
