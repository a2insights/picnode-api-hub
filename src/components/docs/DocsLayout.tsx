import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Code, Shield, Zap, Search, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocsSearch } from './DocsSearch';

interface DocsLayoutProps {
  children: ReactNode;
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
    href: 'https://a2insights.com.br/docs/api',
    external: true,
  },
];

export const DocsLayout = ({ children }: DocsLayoutProps) => {
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
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[240px_1fr] md:gap-6 lg:grid-cols-[280px_1fr] lg:gap-10 px-4 py-8">
        {/* Sidebar */}
        <aside className={`fixed top-16 z-30 h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block ${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:w-auto bg-background border-r md:border-0`}>
          <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            {/* Mobile Search */}
            <div className="md:hidden mb-6 px-4">
              <DocsSearch />
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                if (item.external) {
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.title}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'hover:bg-muted'
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

        {/* Main Content */}
        <main className="relative py-6 lg:py-8">
          <div className="mx-auto w-full max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
