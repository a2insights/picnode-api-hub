import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
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
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('nav.apis')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/#flags" className="hover:text-foreground transition-colors">{t('apis.flags.title')}</Link></li>
              <li><Link to="/#places" className="hover:text-foreground transition-colors">{t('apis.places.title')}</Link></li>
              <li><Link to="/#logos" className="hover:text-foreground transition-colors">{t('apis.logos.title')}</Link></li>
              <li><Link to="/#icons" className="hover:text-foreground transition-colors">{t('apis.icons.title')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('nav.documentation')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">{t('nav.login')}</Link></li>
              <li><Link to="/#contact" className="hover:text-foreground transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {currentYear} PicNode. {t('footer.allRights')}
        </div>
      </div>
    </footer>
  );
};
