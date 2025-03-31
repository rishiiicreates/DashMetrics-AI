import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Sidebar from "@/layout/Sidebar";
import MainContent from "@/layout/MainContent";
import Dashboard from "@/pages/Dashboard";
import { SidebarProvider } from "@/hooks/useSidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      {/* Add more routes below */}
      {/* <Route path="/users" component={Users} /> */}
      {/* <Route path="/analytics" component={Analytics} /> */}
      {/* <Route path="/projects" component={Projects} /> */}
      {/* <Route path="/calendar" component={Calendar} /> */}
      {/* <Route path="/settings" component={Settings} /> */}
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Prevent hydration issues by not rendering until client-side
  if (!isMounted) return null;
  
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <MainContent>
          {children}
        </MainContent>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
