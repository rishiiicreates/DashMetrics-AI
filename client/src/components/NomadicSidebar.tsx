import React from 'react';
import { Link, useLocation } from 'wouter';
import {
  LineChart,
  Users,
  Calendar,
  BriefcaseBusiness,
  MessageSquare,
  SearchCheck,
  Settings,
  LayoutDashboard,
  Bot,
  Gauge,
  Sparkles,
  Trophy
} from 'lucide-react';

const NomadicSidebar: React.FC = () => {
  const [location] = useLocation();
  
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      path: '/' 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <LineChart className="h-5 w-5" />, 
      path: '/analytics',
      badge: 'New'
    },
    { 
      id: 'audience', 
      label: 'Audience', 
      icon: <Users className="h-5 w-5" />, 
      path: '/audience' 
    },
    { 
      id: 'content', 
      label: 'Content', 
      icon: <Calendar className="h-5 w-5" />, 
      path: '/content' 
    },
    { 
      id: 'competitors', 
      label: 'Competitors', 
      icon: <Trophy className="h-5 w-5" />, 
      path: '/competitors' 
    },
    { 
      id: 'ai-insights', 
      label: 'AI Insights', 
      icon: <Sparkles className="h-5 w-5" />, 
      path: '/ai-insights' 
    },
    { 
      id: 'chat', 
      label: 'Ask AI', 
      icon: <Bot className="h-5 w-5" />, 
      path: '/ask-ai' 
    }
  ];
  
  const bottomMenuItems = [
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <Settings className="h-5 w-5" />, 
      path: '/settings' 
    }
  ];
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const MenuItem = ({ item }: { item: typeof menuItems[0] }) => {
    const active = isActive(item.path);
    
    return (
      <Link href={item.path}>
        <a className={`group flex items-center px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all ${
          active 
            ? 'nomadic-button text-white' 
            : 'text-nomadic-darkblue hover:bg-nomadic-crystal/20'
        }`}>
          <span className="mr-3">{item.icon}</span>
          <span>{item.label}</span>
          {item.badge && (
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
              active 
                ? 'bg-white/20 text-white' 
                : 'bg-nomadic-purple/10 text-nomadic-purple'
            }`}>
              {item.badge}
            </span>
          )}
        </a>
      </Link>
    );
  };
  
  return (
    <aside className="p-3 w-60 flex flex-col h-full border-r border-nomadic-crystal/20 bg-white/70 backdrop-blur-sm">
      <div className="h-16 flex items-center px-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-nomadic-crystal to-nomadic-blue/70 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden">
          {/* Crystal shape */}
          <div className="absolute w-full h-full inset-0">
            <div className="absolute transform rotate-45 bg-white/30 w-16 h-1 top-5 -left-2"></div>
            <div className="absolute transform rotate-45 bg-white/20 w-16 h-1 top-8 -left-2"></div>
          </div>
          <span className="text-white text-2xl font-bold">D</span>
        </div>
        <div className="ml-3">
          <h1 className="font-bold text-nomadic-darkblue">DashMetrics</h1>
          <p className="text-xs text-nomadic-blue/70">v1.0</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xs uppercase font-semibold text-nomadic-darkblue/60 px-3 mb-2">Main Navigation</h2>
        <nav>
          {menuItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </nav>
      </div>
      
      {/* Crystal card with pro upgrade */}
      <div className="my-4 crystal-card p-4">
        <div className="flex items-center mb-3">
          <Gauge className="h-5 w-5 text-nomadic-blue mr-2" />
          <h3 className="font-semibold text-nomadic-darkblue">Performance</h3>
        </div>
        <div className="mb-3">
          <div className="text-xs text-nomadic-darkblue/70 mb-1">Social Growth</div>
          <div className="w-full h-1.5 bg-nomadic-crystal/20 rounded-full">
            <div className="h-full w-[75%] bg-gradient-to-r from-nomadic-blue to-nomadic-purple rounded-full"></div>
          </div>
        </div>
        <button className="w-full crystal-button text-sm">View Details</button>
      </div>
      
      <div className="mt-auto">
        <div className="crystal-separator"></div>
        <nav>
          {bottomMenuItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default NomadicSidebar;