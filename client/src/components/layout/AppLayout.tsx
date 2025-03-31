import { useState, useEffect } from "react";
import { Menu, Sun, Moon, Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import NaturalLanguageSearch from "@/components/ui/natural-language-search";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Close mobile menu when the window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Toggle theme between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <div className={cn(
        "fixed inset-0 z-40 md:hidden bg-neutral-900/50 transition-opacity duration-200",
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-neutral-800 shadow-lg"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
            >
              <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Sidebar - visible on desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>
      
      {/* Mobile sidebar toggle - visible only on mobile */}
      <div className="md:hidden fixed bottom-4 left-4 z-30">
        <Button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="p-2 rounded-full bg-primary text-white shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-100 dark:border-neutral-700">
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="relative w-full max-w-xl">
                  <NaturalLanguageSearch />
                </div>
              </div>
              
              <div className="flex items-center ml-4 space-x-4">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-primary"></span>
                </Button>
                
                {/* Theme Toggle */}
                <Button 
                  onClick={toggleTheme} 
                  variant="ghost" 
                  size="icon"
                  className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-6 w-6" />
                  ) : (
                    <Moon className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
