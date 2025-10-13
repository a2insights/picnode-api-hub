import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from './ui/button';
import { Code2 } from 'lucide-react';

export const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg group-hover:scale-110 transition-transform">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PicNode
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/#apis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.apis')}
          </Link>
          <Link to="/#docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.documentation')}
          </Link>
          <Link to="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.contact')}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">{t('nav.login')}</Link>
          </Button>
          <Button size="sm" className="hidden sm:flex" asChild>
            <Link to="/#calculator">{t('hero.buyTokens')}</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
