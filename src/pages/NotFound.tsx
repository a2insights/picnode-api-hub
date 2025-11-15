import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
          {t('notFound.title')}
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {t('notFound.description')}
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            <Home className="w-4 h-4" />
            {t('notFound.backHome')}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
