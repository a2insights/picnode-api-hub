import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthStep } from "@/components/checkout/AuthStep";
import { PaymentMethodStep } from "@/components/checkout/PaymentMethodStep";
import { CardCheckout } from "@/components/checkout/CardCheckout";
import { PixCheckout } from "@/components/checkout/PixCheckout";
import { SuccessStep } from "@/components/checkout/SuccessStep";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenConfig: {
    validity: number;
    limitType: "rateLimit" | "totalRequests";
    rateLimit: number;
    totalRequests: number;
    apis: string[];
  };
  price: string;
  currency?: "USD" | "EUR" | "GBP" | "BRL";
  isFree?: boolean;
}

type CheckoutStep = "auth" | "payment" | "card" | "pix" | "success";

export const CheckoutModal = ({
  open,
  onOpenChange,
  tokenConfig,
  price,
  currency,
  isFree = false,
}: CheckoutModalProps) => {
  const [step, setStep] = useState<CheckoutStep>("auth");
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );

  useEffect(() => {
    if (open) {
      const storedUser = localStorage.getItem("picnode_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        // If free tier, skip directly to success
        setStep(isFree ? "success" : "payment");
      } else {
        setStep("auth");
      }
    }
  }, [open, isFree]);

  const handleAuth = (userData: { email: string; name: string }) => {
    setUser(userData);
    // If free tier, skip payment and go to success
    setStep(isFree ? "success" : "payment");
  };

  const handlePaymentMethod = (method: "card" | "pix") => {
    setStep(method);
  };

  const handleSuccess = () => {
    setStep("success");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("auth");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === "auth" &&
              (isFree ? "Criar Conta Grátis" : "Autenticação")}
            {step === "payment" && "Método de Pagamento"}
            {step === "card" && "Pagamento com Cartão"}
            {step === "pix" && "Pagamento com PIX"}
            {step === "success" && (isFree ? "Parabéns!" : "Compra Concluída")}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {step === "auth" && <AuthStep onAuth={handleAuth} />}
          {step === "payment" && (
            <PaymentMethodStep
              onSelectMethod={handlePaymentMethod}
              price={price}
              currency={currency}
            />
          )}
          {step === "card" && (
            <CardCheckout
              price={price}
              tokenData={{
                name: "Token via Checkout",
                allowed_apis: tokenConfig.apis,
                limit_type:
                  tokenConfig.limitType === "rateLimit"
                    ? "rate_limit"
                    : "total",
                limit_value:
                  tokenConfig.limitType === "rateLimit"
                    ? String(tokenConfig.rateLimit)
                    : String(tokenConfig.totalRequests),
                currency: (currency || "usd").toLowerCase() as "brl" | "usd",
                expires_in_days: tokenConfig.validity,
              }}
              onBack={() => setStep("payment")}
            />
          )}
          {step === "pix" && (
            <PixCheckout
              price={price}
              onSuccess={handleSuccess}
              onBack={() => setStep("payment")}
            />
          )}
          {step === "success" && (
            <SuccessStep
              onClose={handleClose}
              tokenConfig={tokenConfig}
              isFree={isFree}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
