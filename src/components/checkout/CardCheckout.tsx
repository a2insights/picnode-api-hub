import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/services/apiService";
import { toast } from "@/components/ui/use-toast";

interface CardCheckoutProps {
  price: string;
  tokenData: {
    name: string;
    allowed_apis: string[];
    limit_type: "total" | "rate_limit";
    limit_value: string;
    currency: "brl" | "usd";
    expires_in_days: number;
  };
  onBack: () => void;
}

export const CardCheckout = ({
  price,
  tokenData,
  onBack,
}: CardCheckoutProps) => {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCheckout = async () => {
      setError(null);

      try {
        const success_url = `${window.location.origin}/dashboard/tokens`;
        const cancel_url = `${window.location.origin}/dashboard/tokens`;

        const response = await createCheckoutSession({
          ...tokenData,
          success_url,
          cancel_url,
        });

        if (response.checkout_url) {
          window.location.href = response.checkout_url;
        } else {
          throw new Error("No checkout URL returned");
        }
      } catch (err) {
        setError(t("checkout.card.checkoutError"));
        console.log(err);
        setError(err.response.data.message);
        toast({
          title: t("checkout.card.checkoutErrorTitle"),
          description: t("checkout.card.checkoutErrorDescription"),
          variant: "destructive",
        });
        setProcessing(false);
      }
    };

    handleCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← {t("checkout.card.back")}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t("checkout.card.title")}
            </CardTitle>
            <span className="text-2xl font-bold">{price}</span>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          {processing && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p>{t("checkout.card.redirecting")}</p>
            </div>
          )}
          {error && (
            <div className="text-red-500">
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
