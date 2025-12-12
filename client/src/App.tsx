import { Switch, Route, Router, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Partner } from "@/pages/Partner";
import { ProviderPage } from "@/pages/ProviderPage";
import { DynamicSlugPage } from "@/pages/DynamicSlugPage";
import { ClaimListing } from "@/pages/ClaimListing";
import { useEffect } from "react";

// Hook to handle hash scrolling even with hash routing
function ScrollToTop() {
  const [pathname] = useLocation();
  
  useEffect(() => {
    // Handle hash navigation (e.g., /#add-business)
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      // Small timeout to ensure the new page is rendered
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Standard route change - scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  
  return null;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/partner" component={Partner} />
      <Route path="/provider/:id/:slug" component={ProviderPage} />
      <Route path="/claim-listing" component={ClaimListing} />
      {/* Catch-all for both Cities and Providers */}
      <Route path="/:slug" component={DynamicSlugPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <ScrollToTop />
          <Toaster />
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;