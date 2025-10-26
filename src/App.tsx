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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
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

export default App;
