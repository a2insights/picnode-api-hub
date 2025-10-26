import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Code2, LayoutDashboard, Key, Database, CreditCard, FileText, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard.title'), path: '/dashboard' },
    { icon: Key, label: t('dashboard.myTokens'), path: '/dashboard/tokens' },
    { icon: CreditCard, label: t('dashboard.ordersTitle'), path: '/dashboard/orders' },
    { icon: FileText, label: t('dashboard.docs'), path: '/dashboard/docs' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PicNode
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/">← {t('nav.home')}</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
            {user && <span className="text-sm text-muted-foreground">Welcome, {user.name}!</span>}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
