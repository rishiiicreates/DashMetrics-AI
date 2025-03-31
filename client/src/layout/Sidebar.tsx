import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  BarChart2, 
  Folder, 
  Calendar, 
  Settings 
} from "lucide-react";

type NavItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    icon: <Home className="w-6 h-6 mr-3 text-gray-500" />,
    label: "Dashboard",
    href: "/"
  },
  {
    icon: <Users className="w-6 h-6 mr-3 text-gray-500" />,
    label: "Users",
    href: "/users"
  },
  {
    icon: <BarChart2 className="w-6 h-6 mr-3 text-gray-500" />,
    label: "Analytics",
    href: "/analytics"
  },
  {
    icon: <Folder className="w-6 h-6 mr-3 text-gray-500" />,
    label: "Projects",
    href: "/projects"
  },
  {
    icon: <Calendar className="w-6 h-6 mr-3 text-gray-500" />,
    label: "Calendar",
    href: "/calendar"
  },
  {
    icon: <Settings className="w-6 h-6 mr-3 text-gray-500" />,
    label: "Settings",
    href: "/settings"
  }
];

const Sidebar = () => {
  const [location] = useLocation();
  const { sidebarOpen } = useSidebar();

  return (
    <div className={cn(
      "hidden md:flex md:flex-shrink-0", 
      sidebarOpen && "block"
    )}>
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        {/* Sidebar Header */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
            </svg>
            <span className="ml-2 text-xl font-semibold text-gray-800">YourSaaS</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex-grow px-4 mt-2 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md group hover:bg-gray-50 hover:text-gray-900",
                  location === item.href && "bg-blue-50 text-blue-600 border-l-3 border-blue-600",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
          <a href="#" className="flex-shrink-0 block w-full group">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                  U
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Username
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  View profile
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
