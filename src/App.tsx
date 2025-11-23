import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { DashboardOverview } from './pages/Dashboard/DashboardOverview';
import { TokensPage } from './pages/Dashboard/TokensPage';
import { OrdersPage } from './pages/Dashboard/OrdersPage';
import { DocsPage } from './pages/Dashboard/DocsPage';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import Register from './pages/Register';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/Dashboard/ProfilePage';
import { ApiReference } from './pages/ApiReference';
import { GettingStarted } from './pages/GettingStarted';
import { BestPractices } from './pages/BestPractices';
import { Authentication } from './pages/Authentication';
import { useEffect, useState } from 'react';
import { useAppContext } from './contexts/AppContext';
import apiService from './services/apiService';
import { PicnodeProvider } from './contexts/PicnodeContext';

const queryClient = new QueryClient();

const App = () => {
  const { setProject, setApis } = useAppContext();
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('language') || 'pt');

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const projectResponse = await apiService.get('projects/picnode');
        setProject(projectResponse.data.data);

        const lang = localStorage.getItem('language') || 'pt';
        const apisResponse = await apiService.get(
          `apis?filter[project_id]=${projectResponse.data.data.id}&lang=${lang}`,
        );
        setApis(apisResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch app data:', error);
      }
    };

    fetchAppData();
  }, [setProject, setApis, currentLang]);

  // Listen for language changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'language' && e.newValue) {
        setCurrentLang(e.newValue);
      }
    };

    // Listen for custom language change event
    const handleLanguageChange = (e: CustomEvent) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChange', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PicnodeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Public Documentation Routes */}
              <Route path="/docs/getting-started" element={<GettingStarted />} />
              <Route path="/docs/best-practices" element={<BestPractices />} />
              <Route path="/docs/authentication" element={<Authentication />} />

              {/* Public Api Documentation Route */}
              <Route path="/docs/api-reference" element={<ApiReference />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="tokens" element={<TokensPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="docs" element={<DocsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PicnodeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
