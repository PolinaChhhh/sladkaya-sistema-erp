
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import Ingredients from "./pages/Ingredients";
import Production from "./pages/Production";
import Shipping from "./pages/Shipping";
import Receipts from "./pages/Receipts";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Unauthorized from "./pages/Unauthorized";
import { AuthProvider } from "./features/auth/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/unauthorized" element={<Layout requireAuth={false}><Unauthorized /></Layout>} />
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/recipes" element={<Layout><Recipes /></Layout>} />
            <Route path="/ingredients" element={<Layout><Ingredients /></Layout>} />
            <Route path="/production" element={<Layout><Production /></Layout>} />
            <Route path="/shipping" element={<Layout><Shipping /></Layout>} />
            <Route path="/receipts" element={<Layout><Receipts /></Layout>} />
            <Route path="/reports" element={<Layout><Reports /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
