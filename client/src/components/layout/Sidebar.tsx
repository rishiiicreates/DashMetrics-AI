import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard, 
  BarChartBig, 
  Lightbulb, 
  FileBox, 
  Eye, 
  Plus, 
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SocialAccount {
  id: number;
  platform: "youtube" | "instagram" | "twitter";
  handle: string;
  avatarUrl?: string;
}

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [location] = useLocation();
  
  const { data: accountsData } = useQuery<{ accounts: SocialAccount[] }>({
    queryKey: ['/api/accounts'],
  });
  
  // Default accounts if API hasn't returned data yet
  const accounts = accountsData?.accounts || [
    { id: 1, platform: "youtube", handle: "YouTube" },
    { id: 2, platform: "instagram", handle: "Instagram" },
    { id: 3, platform: "twitter", handle: "Twitter" }
  ];
  
  // Get platform icon and color
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube":
        return (
          <div className="w-6 h-6 rounded-full bg-[#FF0000] flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
        );
      case "instagram":
        return (
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#405DE6] via-[#E1306C] to-[#FFDC80] flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
        );
      case "twitter":
        return (
          <div className="w-6 h-6 rounded-full bg-[#1DA1F2] flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Navigation items
  const navItems = [
    { path: "/", icon: <LayoutDashboard className="h-5 w-5 mr-3" />, label: "Dashboard" },
    { path: "/analytics", icon: <BarChartBig className="h-5 w-5 mr-3" />, label: "Analytics" },
    { path: "/insights", icon: <Lightbulb className="h-5 w-5 mr-3" />, label: "AI Insights" },
    { path: "/content", icon: <FileBox className="h-5 w-5 mr-3" />, label: "Content Library" },
    { path: "/competitors", icon: <Eye className="h-5 w-5 mr-3" />, label: "Competitor Analysis" }
  ];
  
  return (
    <aside className="flex flex-col h-full bg-white dark:bg-neutral-800 border-r border-neutral-100 dark:border-neutral-700 transition-all duration-300">
      <div className="p-4 border-b border-neutral-100 dark:border-neutral-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </div>
          <h1 className="text-xl font-heading font-semibold">DashMetrics</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            onClick={onClose}
          >
            <a 
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                location === item.path 
                  ? "bg-primary/10 text-primary dark:text-primary-light" 
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              )}
            >
              {item.icon}
              {item.label}
            </a>
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-700">
          <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Connected Accounts</h3>
          
          <div className="mt-3 space-y-2">
            {accounts.map((account) => (
              <a 
                key={account.id}
                href="#" 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {getPlatformIcon(account.platform)}
                {account.handle}
              </a>
            ))}
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg text-primary dark:text-primary-light border border-primary/30 dark:border-primary-light/30 hover:bg-primary/5 dark:hover:bg-primary-light/5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Account
            </motion.button>
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-neutral-100 dark:border-neutral-700">
        <div className="flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="User profile" 
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <p className="text-sm font-medium">Alex Morgan</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
