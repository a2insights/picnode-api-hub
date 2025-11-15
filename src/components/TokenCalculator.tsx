import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { CheckoutModal } from "@/pages/Landing/CheckoutModal";
import { calculateTotal } from "@/services/apiService";
import { useDebounce } from "@/hooks/use-debounce";

type Currency = "USD" | "EUR" | "GBP" | "BRL";

const currencyConfig = {
  USD: { rate: 1, symbol: "$" },
  EUR: { rate: 0.93, symbol: "€" },
  GBP: { rate: 0.79, symbol: "£" },
  BRL: { rate: 5.4, symbol: "R$" },
};

interface TokenCalculatorProps {
  showTitle?: boolean;
  onComplete?: () => void;
}

export const TokenCalculator = ({
  showTitle = true,
  onComplete,
}: TokenCalculatorProps) => {
  const { t } = useTranslation();
  const { apis } = useAppContext();
  const [validity, setValidity] = useState([7]);
  const [limitType, setLimitType] = useState<"rateLimit" | "totalRequests">(
    "totalRequests"
  );
  const [rateLimit, setRateLimit] = useState([20]);
  const [totalRequests, setTotalRequests] = useState([1000]);
  const [selectedApis, setSelectedApis] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<string>("0.00");
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (apis.length > 0) {
      setSelectedApis(apis.map((api) => api.slug));
    }
  }, [apis]);

  const debouncedValidity = useDebounce(validity, 500);
  const debouncedLimitType = useDebounce(limitType, 500);
  const debouncedRateLimit = useDebounce(rateLimit, 500);
  const debouncedTotalRequests = useDebounce(totalRequests, 500);
  const debouncedSelectedApis = useDebounce(selectedApis, 500);
  const debouncedCurrency = useDebounce(currency, 500);

  const isFreeThier =
    validity[0] <= 7 &&
    ((totalRequests[0] <= 1000 && limitType === "totalRequests") ||
      (rateLimit[0] <= 20 && limitType === "rateLimit"));

  const handleApiChange = (apiId: string) => {
    setSelectedApis((prev) =>
      prev.includes(apiId)
        ? prev.filter((id) => id !== apiId)
        : [...prev, apiId]
    );
  };

  useEffect(() => {
    const fetchPrice = async () => {
      if (selectedApis.length === 0) {
        setCalculatedPrice("0.00");
        return;
      }

      setIsCalculating(true);
      try {
        const response = await calculateTotal({
          allowed_apis: selectedApis,
          limit_type: limitType === "rateLimit" ? "rate_limit" : "total",
          limit_value:
            limitType === "rateLimit" ? rateLimit[0] : totalRequests[0],
          expires_in_days: validity[0],
          currency: currency.toLowerCase() as "usd" | "eur" | "gbp" | "brl",
        });

        const price = parseFloat(response.total).toFixed(2);
        setCalculatedPrice(
          currency === "BRL" ? price.replace(".", ",") : price
        );
      } catch (error) {
        console.error("Error calculating price:", error);
        setCalculatedPrice("0.00");
      } finally {
        setIsCalculating(false);
      }
    };

    fetchPrice();
  }, [
    debouncedSelectedApis,
    debouncedLimitType,
    debouncedRateLimit,
    debouncedTotalRequests,
    debouncedValidity,
    debouncedCurrency,
  ]);

  const handleCheckoutClose = (open: boolean) => {
    setCheckoutOpen(open);
    if (!open && onComplete) {
      onComplete();
    }
  };

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        {showTitle && (
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              {t("calculator.title")}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-medium">
              {t("calculator.currency")}
            </label>
            <ToggleGroup
              type="single"
              value={currency}
              onValueChange={(value: Currency) => value && setCurrency(value)}
              className="justify-start"
            >
              <ToggleGroupItem value="USD">USD</ToggleGroupItem>
              <ToggleGroupItem value="EUR">EUR</ToggleGroupItem>
              <ToggleGroupItem value="GBP">GBP</ToggleGroupItem>
              <ToggleGroupItem value="BRL">BRL</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">
              {t("calculator.apis")}
            </label>
            <div className="grid grid-cols-2 gap-4">
              {apis.map((api) => (
                <div key={api.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={api.slug}
                    checked={selectedApis.includes(api.slug)}
                    onCheckedChange={() => handleApiChange(api.slug)}
                  />
                  <Label htmlFor={api.slug} className="cursor-pointer">
                    {api.name}
                  </Label>
                </div>
              ))}
            </div>
            {selectedApis.length === 0 && (
              <p className="text-sm text-destructive">
                {t("calculator.selectAtLeastOneApi")}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                {t("calculator.validity")}
              </label>
              <span className="text-sm text-muted-foreground">
                {validity[0]} {t("checkout.success.days")}
              </span>
            </div>
            <Slider
              value={validity}
              onValueChange={setValidity}
              min={7}
              max={365}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">
              {t("calculator.limitType")}
            </label>
            <RadioGroup
              value={limitType}
              onValueChange={(value) =>
                setLimitType(value as "rateLimit" | "totalRequests")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rateLimit" id="rateLimit" />
                <Label htmlFor="rateLimit" className="cursor-pointer">
                  {t("calculator.rateLimit")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="totalRequests" id="totalRequests" />
                <Label htmlFor="totalRequests" className="cursor-pointer">
                  {t("calculator.totalRequests")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {limitType === "rateLimit" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  {t("calculator.rateLimit")}
                </label>
                <span className="text-sm text-muted-foreground">
                  {rateLimit[0]} req/min
                </span>
              </div>
              <Slider
                value={rateLimit}
                onValueChange={setRateLimit}
                min={10}
                max={1000}
                step={10}
                className="w-full"
              />
            </div>
          )}

          {limitType === "totalRequests" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  {t("calculator.totalRequests")}
                </label>
                <span className="text-sm text-muted-foreground">
                  {totalRequests[0].toLocaleString()}
                </span>
              </div>
              <Slider
                value={totalRequests}
                onValueChange={setTotalRequests}
                min={1000}
                max={1000000}
                step={5000}
                className="w-full"
              />
            </div>
          )}

          <div className="pt-6 border-t border-border">
            {!isFreeThier && (
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">
                  {t("calculator.estimatedPrice")}
                </span>
                {isCalculating ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {currencyConfig[currency].symbol}
                    {calculatedPrice}
                  </span>
                )}
              </div>
            )}
            {isFreeThier ? (
              <Button
                className="w-full gap-2 group"
                size="lg"
                onClick={() => setCheckoutOpen(true)}
                disabled={selectedApis.length === 0}
              >
                <Sparkles className="h-5 w-5" />
                {t("calculator.getFreeToken")}
              </Button>
            ) : (
              <Button
                className="w-full gap-2 group"
                size="lg"
                onClick={() => setCheckoutOpen(true)}
                disabled={selectedApis.length === 0 || isCalculating}
              >
                {t("calculator.proceed")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={handleCheckoutClose}
        tokenConfig={{
          validity: validity[0],
          limitType,
          rateLimit: rateLimit[0],
          totalRequests: totalRequests[0],
          apis: selectedApis,
        }}
        price={calculatedPrice}
        currency={currency}
        isFree={isFreeThier}
      />
    </>
  );
};
