import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { DashboardOverview } from "./pages/Dashboard/DashboardOverview";
import { TokensPage } from "./pages/Dashboard/TokensPage";
import { OrdersPage } from "./pages/Dashboard/OrdersPage";
import { DocsPage } from "./pages/Dashboard/DocsPage";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Register from "./pages/Register";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/Dashboard/ProfilePage";
import { GettingStarted } from "./pages/GettingStarted";
import { BestPractices } from "./pages/BestPractices";
import { Authentication } from "./pages/Authentication";
import { useEffect } from "react";
import { useAppContext } from "./contexts/AppContext";
import apiService from "./services/apiService";

const queryClient = new QueryClient();

const App = () => {
  const { setProject, setApis } = useAppContext();

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const projectResponse = await apiService.get("projects/picnode");
        setProject(projectResponse.data.data);

        const apisResponse = await apiService.get(
          `apis?filter[project_id]=${projectResponse.data.data.id}`
        );
        setApis(apisResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch app data:", error);
      }
    };

    fetchAppData();
  }, [setProject, setApis]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Public Documentation Routes */}
            <Route path="/docs/getting-started" element={<GettingStarted />} />
            <Route path="/docs/best-practices" element={<BestPractices />} />
            <Route path="/docs/authentication" element={<Authentication />} />
            
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
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
