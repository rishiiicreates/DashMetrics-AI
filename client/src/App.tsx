import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { DashboardProvider } from "@/context/DashboardContext";
import { useEffect, useState } from "react";

// Nomadic Tribe background component
function NomadicBackground() {
  const [elements, setElements] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    // Generate random crystal, leaf, and bird elements
    const newElements: JSX.Element[] = [];
    
    // Add crystals
    for (let i = 0; i < 5; i++) {
      const size = Math.floor(Math.random() * 80) + 40; // 40-120px
      const left = Math.floor(Math.random() * 90); // 0-90%
      const top = Math.floor(Math.random() * 80); // 0-80%
      const rotation = Math.floor(Math.random() * 360); // 0-360deg
      const delay = Math.random() * 10; // 0-10s delay
      const duration = Math.floor(Math.random() * 10) + 15; // 15-25s duration
      
      newElements.push(
        <div 
          key={`crystal-${i}`}
          className="crystal"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            transform: `rotate(${rotation}deg)`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
          }}
        />
      );
    }
    
    // Add leaves
    for (let i = 0; i < 7; i++) {
      const size = Math.floor(Math.random() * 60) + 30; // 30-90px
      const left = Math.floor(Math.random() * 95); // 0-95%
      const top = Math.floor(Math.random() * 90); // 0-90%
      const duration = Math.floor(Math.random() * 5) + 10; // 10-15s duration
      const delay = Math.random() * 5; // 0-5s delay
      
      newElements.push(
        <div 
          key={`leaf-${i}`}
          className="leaf"
          style={{
            width: `${size}px`,
            height: `${size * 1.2}px`,
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
          }}
        />
      );
    }
    
    // Add birds
    for (let i = 0; i < 3; i++) {
      const size = Math.floor(Math.random() * 20) + 20; // 20-40px
      const top = Math.floor(Math.random() * 60) + 10; // 10-70%
      const delay = Math.random() * 10; // 0-10s delay
      const duration = Math.floor(Math.random() * 20) + 30; // 30-50s duration
      
      newElements.push(
        <div 
          key={`bird-${i}`}
          className="bird"
          style={{
            width: `${size}px`,
            height: `${size/2}px`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
          }}
        />
      );
    }
    
    // Add sparkles
    for (let i = 0; i < 15; i++) {
      const size = Math.floor(Math.random() * 8) + 4; // 4-12px
      const left = Math.floor(Math.random() * 98); // 0-98%
      const top = Math.floor(Math.random() * 95); // 0-95%
      const delay = Math.random() * 8; // 0-8s delay
      const duration = Math.floor(Math.random() * 2) + 3; // 3-5s duration
      
      newElements.push(
        <div 
          key={`sparkle-${i}`}
          className="sparkle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
          }}
        />
      );
    }
    
    setElements(newElements);
  }, []);
  
  return (
    <div className="nature-bg">
      {elements}
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  
  return (
    <Switch location={location}>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <DashboardProvider>
            <NomadicBackground />
            <Router />
            <Toaster />
          </DashboardProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
