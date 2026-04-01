import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import DiaryBackground from "@/components/DiaryBackground";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Diary from "./pages/Diary";
import Insights from "./pages/Insights";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import "@/styles/landing.css";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DiaryBackground />
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Index />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
