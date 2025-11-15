import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Button } from './ui/button';
import { Code2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout, logoutLoading } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
          <button onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.home')}
          </button>
          <button onClick={() => scrollToSection('apis')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.apis')}
          </button>
          <a href="https://a2insights.com.br/docs/api#/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.documentation')}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">{t('nav.dashboard')}</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} disabled={logoutLoading}>
                {logoutLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {logoutLoading ? t('nav.loggingOut') : t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/register">{t('nav.register')}</Link>
              </Button>
            </>
          )}
          <Button size="sm" className="hidden sm:flex" onClick={() => scrollToSection('calculator')}>
            {t('hero.buyTokens')}
          </Button>
        </div>
      </div>
    </nav>
  );
};
