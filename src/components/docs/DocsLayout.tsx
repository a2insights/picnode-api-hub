import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Code, Shield, Zap, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocsSearch } from './DocsSearch';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface DocsLayoutProps {
  children: ReactNode;
  secondarySidebar?: ReactNode;
}

const menuItems = [
  {
    icon: Code,
    title: 'Getting Started',
    href: '/docs/getting-started',
  },
  {
    icon: Zap,
    title: 'Best Practices',
    href: '/docs/best-practices',
  },
  {
    icon: Shield,
    title: 'Authentication',
    href: '/docs/authentication',
  },
  {
    icon: Book,
    title: 'API Reference',
    href: '/docs/api-reference',
  },
] as const;

export const DocsLayout = ({ children, secondarySidebar }: DocsLayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">PicNode Docs</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <DocsSearch />
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div
        className={`container flex-1 items-start md:grid md:gap-6 lg:gap-2 px-2 py-8 ${
          secondarySidebar
            ? 'md:grid-cols-[220px_240px_1fr]'
            : 'md:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr]'
        }`}
      >
        {/* Main Sidebar */}
        <aside
          className={`fixed top-16 z-30 h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block ${
            mobileMenuOpen ? 'block' : 'hidden'
          } md:w-auto bg-background border-r md:border-0`}
        >
          <ScrollArea className="h-full  pr-6 ">
            {/* Mobile Search */}
            <div className="md:hidden mb-6 px-4">
              <DocsSearch />
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.title}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-muted font-medium text-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Secondary Sidebar */}
        {secondarySidebar && (
          <aside className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-hidden border-r bg-background/50">
            <ScrollArea className="h-full">{secondarySidebar}</ScrollArea>
          </aside>
        )}

        {/* Main Content */}
        <main className="relative  ">
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
