import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const PaymentsPage = () => {
  const { t } = useTranslation();

  const payments = [
    {
      date: '2025-01-10',
      token: 'pk_live_51234567890',
      amount: '$49.99',
      method: 'Credit Card',
      status: 'completed',
    },
    {
      date: '2024-12-15',
      token: 'pk_live_98765432101',
      amount: '$29.99',
      method: 'PayPal',
      status: 'completed',
    },
    {
      date: '2024-11-20',
      token: 'pk_live_11223344556',
      amount: '$79.99',
      method: 'Credit Card',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.payments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('dashboard.paymentsTable.date')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('dashboard.paymentsTable.token')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('dashboard.paymentsTable.amount')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('dashboard.paymentsTable.method')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('dashboard.paymentsTable.status')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 px-4 text-sm">{payment.date}</td>
                    <td className="py-3 px-4">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {payment.token}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{payment.amount}</td>
                    <td className="py-3 px-4 text-sm">{payment.method}</td>
                    <td className="py-3 px-4">
                      <Badge variant="default" className="bg-green-500/10 text-green-500">
                        {payment.status}
                      </Badge>
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
