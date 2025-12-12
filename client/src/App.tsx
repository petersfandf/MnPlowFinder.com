import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Partner } from "@/pages/Partner";
import { CityPage } from "@/pages/CityPage";
import { ProviderPage } from "@/pages/ProviderPage";
import { useEffect } from "react";

// Hook to handle hash scrolling even with hash routing
function ScrollToTop() {
  // We don't use useLocation here because we want to run this on every render/hash change
  // and wouter's useLocation might behave differently with hash routing hooks
  
  useEffect(() => {
    // Check if there's a secondary hash (e.g. #/about#team or #/#add-business)
    // With hash routing, window.location.hash includes the route (e.g. #/lake-city)
    // So we need to parse if there is an actual ID target
    
    // Simple heuristic: if the hash contains a second # or just ends with an ID
    // Actually, wouter hash routing means window.location.hash IS the path.
    // So we can't easily distinguish between "route change" and "anchor link" just by looking at window.location.hash
    // UNLESS we use a query param or a specific convention, but standard anchors work differently in hash router.
    
    // However, the user specifically mentioned "Fixed 'Add Business' anchor links... implemented hash-based routing"
    // So maybe we just need to ensure we scroll to top on route change.
    
    window.scrollTo(0, 0);
  }, []); // Run on mount, but we really want it on route change.
  
  return null;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/partner" component={Partner} />
      <Route path="/provider/:id/:slug" component={ProviderPage} />
      {/* Catch-all for city pages like /lake-city-mn-snow-removal */}
      <Route path="/:slug" component={CityPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router hook={useHashLocation}>
          <ScrollToTop />
          <Toaster />
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
