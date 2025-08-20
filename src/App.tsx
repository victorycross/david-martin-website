import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Home from "./pages/Home";
import Writing from "./pages/Writing";
import Creative from "./pages/Creative";
import Applications from "./pages/Applications";
import Health from "./pages/Health";
import About from "./pages/About";
import Socials from "./pages/Socials";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const [mounted, setMounted] = useState(false);
  const { loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/creative" element={<Creative />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/health" element={<Health />} />
            <Route path="/about" element={<About />} />
            <Route path="/socials" element={<Socials />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;