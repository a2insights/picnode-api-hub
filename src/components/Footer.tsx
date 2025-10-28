import { useTranslation } from 'react-i18next';
import { Code2 } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PicNode
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            {t('hero.subtitle')}
          </p>
          <div className="pt-4 text-sm text-muted-foreground">
            © {currentYear} PicNode. {t('footer.allRights')}
          </div>
        </div>
      </div>
    </footer>
  );
};
